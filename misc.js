var esUtil = require('./es-util');
var redis = require('./redis_store');


module.exports = {

    getContentBasedResults: async function(userid, callback){
        //var arr = this.arrayUnique([1,2,3,4,5,6,6,6,6,7,8,9])
        /*var posts = await redis.getUserActivity(userid);
        console.log('useractivity-->' +JSON.stringify(posts));

        var queryStr= '';
        for(var post of posts){

            //console.log('post->' +JSON.stringify(post));

            var queryWords = await redis.getQueryWordsForPost(post);
            //console.log('query words for post--> ' + post.Title + '-->' +JSON.stringify(queryWords))
            //result[post.id] = queryWords
            var count = 0;
            for(var obj of queryWords){

                if(count==1){
                    break;
                }
                queryStr+= (' ' + obj['n-gram']);
                count++;

            }
        }*/

        var queryStr = await redis.getQueryWords(userid);
        console.log('query words -->' +JSON.stringify(queryStr));

        var response =  await (esUtil.doSearch(queryStr));
        console.log('response-->' +JSON.stringify(response));
        callback(null, response)
    },

    getCollaborativeResults: async function(userid, callback){

         var cfresponse = await (redis.actualSearchForRecommendations(userid));
         console.log('collaborative filtering response-->' +JSON.stringify(cfresponse));
         callback(null, cfresponse);
    }
}

