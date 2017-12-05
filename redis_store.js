var conf = require('./config'),
mysql = require('mysql'),
redis = require("redis"),
fs = require('fs');


client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = {

    saveUserPreferences: function(preferences){
        return new Promise(function(resolve, reject){

            client.hset('test', 'preferences', JSON.stringify(preferences), function(err, replies){
                console.log(JSON.stringify(replies));
                resolve('success');
            })
        });
    },

    getPreferences: function(userid){
        console.log('getting preferencs for user-->' +userid);
        return new Promise(function(resolve, reject){
            client.hget('test', 'preferences', function(err, replies){
                console.log('preferences object-->' +replies.trim());

                var repliesObj = JSON.parse(replies.trim());
                console.log('replies obj-->' +repliesObj);
                if(userid==-1){
                    resolve(repliesObj);
                }

                var isEmpty = true;
                for(var key in repliesObj) {
                    if(repliesObj.hasOwnProperty(key)){
                        console.log('key-->' +key + ' value-->' +repliesObj[key]);
                        isEmpty = false;
                    }
                }
                if(isEmpty == true){
                    console.log('empty object');
                    resolve({})
                }else{
                    console.log('non empty object');
                    if(userid in repliesObj){
                        console.log('user preferences-->' +JSON.stringify(repliesObj[userid]));
                        resolve(repliesObj[userid])
                    }else{
                        resolve({})
                    }
                }
            });
        })
    },

    getObjLinks: function(questionId){

        return new Promise(function(resolve, reject){

            client.hget('test', 'linkobjs', function(err, replies){

                replies = JSON.parse(replies);
                console.log('replies-->' +replies);
                if(questionId in replies){
                    resolve(replies[questionId])
                }else{
                    resolve([])
                }
            });
        })

    },

    getUserTags: function(userid){

        return new Promise(function(resolve, reject){

            client.hget('test', 'user_tag_store', function(err, replies){

                replies = JSON.parse(replies);
                //console.log(replies);
                if(userid in replies){
                    resolve(replies[userid]);
                }else{
                    resolve([]);
                }
            });
        });
    },

    getQueryWords: function(userid){

        return new Promise(function(resolve, reject){
            client.hget('test', 'user_keywords_store', function (err, replies) {
                //console.log(replies);
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

    getTagWordsForUser: function(userid){

    	return new Promise(function(resolve, reject){

            client.hget('test', 'user_tag_store', function (err, replies) {
                var user_tag_store = JSON.parse(replies);
                //console.log('user tag store-->' +JSON.stringify(user_tag_store));
                for (var user in user_tag_store) {
                    if (user_tag_store.hasOwnProperty(user) && user == userid) {
                        console.log('tag words for user-->' + JSON.stringify(user_tag_store[user]));
                        resolve(user_tag_store[user]);
                    }
                }
                resolve('');

            });

		});
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