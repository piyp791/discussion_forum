var stemmer = require('porter-stemmer').stemmer;
var esUtil = require('./es-util');
var redis = require('./redis_store');
var sw = require('stopword')
var dbHelper = require('./db-helper');

module.exports = {

    arrayUnique: function(array) {

        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    },

    searchRecommendations: async function(userid, data, callback){

        //console.log(data);
        var tagArr = [];
        for(var post of data){
            
            //wordcloud += ( " " + post.Title);
            //wordcloud +=(" " + post.Body);
            var postTagArr = []
            if(post.Tags!=null){

                postTagArr = post.Tags.split('>')
                for(var i=0;i<postTagArr.length;i++){
                    postTagArr[i] = postTagArr[i].replace('<', '')
                }
                postTagArr.splice(-1,1);
                console.log('formatted tags array-->'+ postTagArr)
                //return tagsArr;
                //console.log(post.Title)
                //console.log(post.Body)
                console.log(postTagArr);

                tagArr =  this.arrayUnique(tagArr.concat(postTagArr))

            }
               
        }

        //console.log('final tag array -->' +tagArr)

        tagArr = tagArr.slice(0, 5)
        var wordcloud = tagArr.join();
        //res.json(JSON.stringify(data))
        //wordcloud forms the query
        //wordcloud = wordcloud.replace(/[^\w\s!?]/g,'');
        //wordcloud = wordcloud.replace("null", "")
        //console.log('word cloud -->' + wordcloud)
        //wordcloud = stemmer(wordcloud);

        console.log('number of words -->' +tagArr.length)
        //var wordcloud_ar = sw.removeStopwords(wordcloud.split(" "))
        //console.log('number of words after stop words-->' +wordcloud_ar.length)
        //wordcloud = wordcloud_ar.join();
        //wordcloud = wordcloud.substring(0, 1000)
        //console.log('stem post-->' +stempost)

        //Content Based Recommendations
        //var response =  await (esUtil.doSearch(wordcloud));

        //Collaborative Filtering Recommendations
        var cfresponse = await (redis.actualSearchForRecommendations(userid))


        //tag to question mapping
            
        var suggestions = cfresponse['5'].slice(0, 5);
        ///tagid to tag name mapping
        suggestions = "discussion,featured,https,moderator,meta";
        //callback(null, response)
        dbHelper.getHomePageLinks(suggestions, 5, function(err, data){
             if(err){
                console.log('some error!!');
                res.render('home.ejs', {'homePageContent': 'hahahahahaha'});
            }else{
                callback(null, JSON.stringify(data));
            }
        })
        
        //console.log('response-->' +response)
        //return response;
    }
}

