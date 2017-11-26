var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'debug'
});


module.exports = {

	doSearch: function(querywords, tags_words){

		querywords = querywords.replace("," , " ");
		console.log('query -->' +querywords);

		tags_words = "soccer,control,microcontroller,raspberry-pi,arduino,wheeled-robot, localization";

		var special_tag_words = "computer-vision, mobile-robot";

        return new Promise(function(resolve, reject){
			// Retrieve an access token
            client.search({
                index: 'df',
                body: {
                    query: {
                        bool:{
                        	must:[{
                                match:{
                                    tags: {query: special_tag_words.toString(), boost: 3, }
                                }},
								{match:{
                        			tags:{query: tags_words.toString()}
								}}
							],
							should:{
                        		match:{
                        			content:querywords
								}
							}
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