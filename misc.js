var dbHelper = require('./db-helper');

module.exports = {
   
    getPageLinks: async function(questionId, callback){

        pagelinks = await dbHelper.getPageLinks(questionId);
        //pagelinks = await redis.getObjLinks(questionId);
        callback(null, pagelinks);
    }
}

