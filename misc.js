var esUtil = require('./es-util');
var redis = require('./redis_store');

module.exports = {

    savePreferences: async function(preferences, userid, callback){

      var allpreferences = await redis.getPreferences(-1);
      console.log('misc allpreferences---->' +allpreferences);
      if(allpreferences == "null" || allpreferences == null){
          allpreferences = {};
      }
      allpreferences[userid] = preferences;
      var result = await redis.saveUserPreferences(allpreferences);
      callback(null ,'success');
    },

    getPreferences: async function(userid, callback){
        var preferences = await redis.getPreferences(userid, callback);
        callback(null, preferences);
    },

    getContentBasedResults: async function(userid, preferences, callback){

        var queryStr = await redis.getQueryWords(userid);
        //console.log('query words -->' +JSON.stringify(queryStr));

        let boostdict = null;
        var tagQryStr = []
        for(let tag in preferences['tags']){
            let value = preferences['tags'][tag];
            console.log('tag-->' +tag + ' value-->' +preferences['tags'][tag]);
            if(boostdict == null){
                boostdict = {};
                boostdict[value] = {match:{tags: {query: [tag], boost: value}}};
            }else{
                if(value in boostdict){
                    console.log('boost dict value-->' +JSON.stringify(boostdict[value]));
                    boostdict[value]['match']['tags']['query'].push(tag);
                }else{
                    boostdict[value] = {match:{tags: {query: [tag], boost: value}}};
                }
            }
        }

        for(let item in boostdict){
            console.log(JSON.stringify(boostdict[item]));


            let queryWords = boostdict[item]['match']['tags']['query'];
            queryWords = queryWords.toString();
            boostdict[item]['match']['tags']['query'] = queryWords
            tagQryStr.push(boostdict[item])
        }

        tagQryStr.push({match:{
            content:queryStr}});
        console.log(JSON.stringify(tagQryStr));
        var response =  await (esUtil.doSearch(queryStr, tagQryStr));
        //console.log('response-->' +JSON.stringify(response));
        callback(null, response);
    },

    getUserTags: async function(userid, callback){

        var tags = await redis.getUserTags(userid);
        console.log('user tags-->' +JSON.stringify(tags));
        callback(null, tags);
    },

    getCollaborativeResults: async function(userid, callback){

         var cfresponse = await (redis.actualSearchForRecommendations(userid));
         //console.log('collaborative filtering response-->' +JSON.stringify(cfresponse));

         //map ids to questions titles
         callback(null, cfresponse);
    },

    getPageLinks: async function(questionId, callback){

        pagelinks = await redis.getObjLinks(questionId);
        callback(null, pagelinks);
    }
}

