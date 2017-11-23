var conf = require('./config');
var mysql = require('mysql');
var redis = require("redis");
fs = require('fs');


client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = {

	getUserActivity: function(userid){

		//console.log('get user activity from redis...');
		return new Promise(function(resolve, reject){
			client.hget('test', 'user_activity_obj', function (err, replies) {
		    	//console.log(replies);

		    	replies = JSON.parse(replies);
		    	if(userid in replies){
		    		var suggestions = replies[userid];
		    	}else{
		    		console.log('user id not present in table....')
					var suggestions = [];

		    	}
		    	
		    	//console.log('suggestions-->' + JSON.stringify(suggestions));
		    	resolve(suggestions);
			});
		})
	},

	getQueryWordsForPost: function(post){

		return new Promise(function(resolve, reject){
			client.hget('test', 'tfidf_obj', function (err, replies) {
		    	//console.log(replies);
				//replies = JSON.parse(replies);

		    	var suggestions = replies[post.id];
		    	//console.log('suggestions-->' + JSON.stringify(suggestions));
		    	resolve(suggestions);
			});
		})
	},

    getQueryWords: function(userid){

        return new Promise(function(resolve, reject){
            client.hget('test', 'user_keywords_store', function (err, replies) {
                console.log(replies);
                replies = JSON.parse(replies);
                if(userid in replies){
                    var queryStr = '';
                    replies = replies[userid];
                    for(var word of replies) {
                        queryStr += (word['n-gram'] + ' ');
                    }
                    resolve(queryStr);

				}else{
					resolve('')
				}

            });
        })
    },

	actualSearchForRecommendations: function (userid){
		console.log('searching via collaborative filtering for user id-->' +userid);

		return new Promise(function(resolve, reject){
			client.hget('test', 'user_counter_dict', function (err, replies) {
		    	//console.log(replies);

		    	replies = JSON.parse(replies)
		    	if(userid in replies){

		    		var translated_userid = replies[userid];
			    	console.log('translated user id -->' +translated_userid)
			    	client.hget('test', 'suggestions_dict', function (err, replies) {
				    	//console.log(replies);
				    	replies = JSON.parse(replies);
				    	var suggestions = replies[translated_userid];

				    	//load the post dictionary
				    	client.hget('test', 'post_counter_dict', function (err, replies) {

				    		post_dictionary = JSON.parse(replies);
				    		//console.log('post dictionary-->' +JSON.stringify(post_dictionary))
				    		posts = [];

				    		for(var post of suggestions){
				    			console.log('post id -->' +post[0]);
				    			for (var key in post_dictionary) {
								    if (post_dictionary.hasOwnProperty(key) && post_dictionary[key] == post[0]) {
								        //console.log(key + " -> " + post_dictionary[key]);
								        posts.push(key);
								    }
								}
				    		}

				    		client.hget('test', 'post_store', function(err, replies){

				    			var post_store = JSON.parse(replies);
				    			//console.log('post store-->' + JSON.stringify(post_store));
                                var titles = [];
				    			for(var post of posts){
                                    if(post in post_store){
                                        console.log('its a question...');
                                        var title = post_store[post]['Title'];
                                        console.log('Title-->' +title);
                                        titles.push(title);
                                    }else{
                                        console.log('its an answer');
                                        for (var key in post_store) {
                                            if (post_store.hasOwnProperty(key)) {
                                                if(post_store[key]['answers'].indexOf(post)>-1){
                                                    console.log('title-->' +post_store[key]['Title']);
                                                    titles.push(post_store[key]['Title']);
                                                    break;
                                                }
                                            }
                                        }

                                    }
								}

                                resolve(titles);

							});


				    	});
				    	
					});
		    	}else{
		    		console.log('user id doesnt exist here. no collaborative filtering here.')
		    		resolve([])
		    	}
			});
		});
	}
}