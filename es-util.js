var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'debug'
});

module.exports = {

	doSearch: function(querywords, tagQryStr){

        return new Promise(function(resolve, reject){
			// Retrieve an access token
            client.search({
                index: 'df',
				size: 30,
                body: {
                    query: {
                        bool:{
                        	should: tagQryStr
						}
                    }
                }
            })
			  .then(function(data) {
			  	//console.log('data-->' + JSON.stringify(data['hits']))
				resolve(data);
			  }, function(err) {
			    console.log('Something went wrong when searching', err.message);
			    //cb(err, null)
			    reject(err);
			});	
		})
	}
}