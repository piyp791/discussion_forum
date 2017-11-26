var esUtil = require('./es-util');
var redis = require('./redis_store');


module.exports = {

    getContentBasedResults: async function(userid, callback){

        var queryStr = await redis.getQueryWords(userid);
        //console.log('query words -->' +JSON.stringify(queryStr));

        var tagWords = await redis.getTagWordsForUser(userid);
        console.log('tag words -->' + JSON.stringify(tagWords));

        var response =  await (esUtil.doSearch(queryStr, tagWords));
        //console.log('response-->' +JSON.stringify(response));
        callback(null, response);
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

