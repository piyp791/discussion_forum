var conf = require('./config');
var mysql = require('mysql');
var redis = require("redis");
fs = require('fs');
var jpickle = require('jpickle');


client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = {
	actualSearchForRecommendations: function (userid){

		console.log('searching via collaborative filtering...');
		return new Promise(function(resolve, reject){
			client.hget('test', 'suggestions_dict', function (err, replies) {
		    	//console.log(replies);
		    	var suggestions = JSON.parse(replies);
		    	resolve(suggestions);
			});
		})
	}
}

function doConnect(){
	console.log('establishing connection to DB....')
	
	connection = mysql.createConnection({
  		host     : conf.app.dbUri,
  		user     : conf.app.dbUser,
  		password : conf.app.dbPassword,
  		database: "forum_db"
	});	

	return new Promise(function(resolve, reject){

		connection.connect(function(err){
			if(err){
				reject(err)
			}else{
				resolve(connection)
			}
		});
	});
}

function getPostsFromDB(connection){
	var query = "select * from Posts"
  	//console.log('query-->' +query);

  	return new Promise(function(resolve, reject){

  		connection.query(query, function(err, result, fields){

  			if(err){
				console.log(err);
				//callback(err, null);
				reject(err)
			}
			//console.log('number of rows returned -->' +JSON.stringify(result));
			resolve(result)
	  	});
  	});
}

function getUsersFromDB(connection){
	var query = "select OwnerUserId from Posts where OwnerUserId is not null group by OwnerUserId order by OwnerUserId asc";
	//var query = "select Id from Users order by Id asc;"
  	//console.log('query-->' +query);

  	return new Promise(function(resolve, reject){

  		connection.query(query, function(err, result, fields){

  			if(err){
				console.log(err);
				//callback(err, null);
				reject(err)
			}
			//console.log('number of rows returned -->' +JSON.stringify(result));
			resolve(result)
	  	});
  	});
}

function getParentTags(post, dbpostdata){

	//get tags of parents
	var tagstr = ''
	var parentId = post.ParentId;
	for(var item of dbpostdata){
		if(item.Id == parentId){
			//get tags
			tagstr = item.Tags
			break;
		}
	}
	return tagstr

}

function getPostTags(post, dbpostdata){

	var postType = post.PostTypeId;
	if(postType == '1'){
		var tagstr = post.Tags;
		
	}else if(postType == '2'){
		var tagstr = getParentTags(post, dbpostdata)
	}

	//console.log('tags -->' +tagstr)
	tagsarr = []
	finaltagarr = []
	if(tagstr!=null){
		tagsarr = tagstr.split('><');
		tagsarr[0] = tagsarr[0].substring(1, tagsarr[0].length)
		tagsarr[tagsarr.length-1] = tagsarr[tagsarr.length-1].substring(0, tagsarr[tagsarr.length-1].length-1);
		
	}	

	return tagsarr
}

function appendNewTags(tagsarr, postdatajson, post){

	var userid = post.OwnerUserId;
	var postType = post.PostTypeId;
	var postId = post.ID;

	for(var tag of tagsarr){

		var flag = false;
		for(var item of postdatajson){
			if(item.tagname == tag){
				flag = true;

				//add user and post info
				if(postType == '1'){
					//insert user details
					//console.log(postdatajson)
					if(item['details']['users'][userid]){
						//console.log('post 1 exists')
						item['details']['users'][userid]['questions'].push(postId);
						
					}else{
						//console.log('post 1 doesnt exists');
						item['details']['users'][userid] = {};
						item['details']['users'][userid]['questions'] = []
						item['details']['users'][userid]['answers'] = []
						item['details']['users'][userid]['questions'].push(postId);
					}

					//console.log('user details inserted')
					
					//insert post details
					item['details']['questions'].push(post);
					//console.log('post details insertted')					
				}else if(postType == '2'){
					//insert user details
					if(item['details']['users'][userid]){
						//console.log('post 2 exists')
						item['details']['users'][userid]['answers'].push(postId);
						
					}else{
						//console.log('post 2 doesnt exists');
						item['details']['users'][userid] = {};
						item['details']['users'][userid]['answers'] = []
						item['details']['users'][userid]['questions'] = []
						item['details']['users'][userid]['answers'].push(postId);
					}

					//console.log('user details inserted')
					
					//insert post details
					item['details']['answers'].push(post);	
				}
				//postdatajson.push(tagobj)
				break;
			}
		}

		if(flag == false){
			//add item tag to array
			tagobj = {}
			tagobj['tagname'] = tag
			tagobj['details'] = {'users':{}, 'questions':[], 'answers':[]}

			if(postType == '1'){
				//insert user details
				tagobj['details']['users'][userid] = {}
				tagobj['details']['users'][userid]['questions'] = []
				tagobj['details']['users'][userid]['answers'] = []
				tagobj['details']['users'][userid]['questions'].push(postId);

				//insert post details
				tagobj['details']['questions'].push(post);					
			}else if(postType == '2'){
				//insert user details
				tagobj['details']['users'][userid] = {}
				tagobj['details']['users'][userid]['answers'] = []
				tagobj['details']['users'][userid]['questions'] = []
				tagobj['details']['users'][userid]['answers'].push(postId);

				//insert post details
				tagobj['details']['answers'].push(post);	
			}
			
			postdatajson.push(tagobj)
		}
	}
	return postdatajson;
}

function addPostDetails(post, postdatajson){

	return postdatajson
}

function getUserTagDataFromPosts(dbpostdata){

	var postdatajson = [];

	console.log('number of posts-->' +dbpostdata.length)
 	for(var post of dbpostdata){

 		//console.log('post ID-->' +post.ID)
 		var tagsarr = getPostTags(post, dbpostdata);
 		//console.log(tagsarr)
 		postdatajson =  appendNewTags(tagsarr, postdatajson, post);
 		//console.log('postdatajson-->' +JSON.stringify(postdatajson))

 		//add user details 
 		//postdatajson  =  adduserDetails(post, postdatajson, dbpostdata)
 		//console.log('postdatajson-->' +JSON.stringify(postdatajson))
 	}

 	//console.log('postdatajson-->' +JSON.stringify(postdatajson))
 	return postdatajson;
}


function saveInRedis(key, value, table){
	client.hset(table, key, JSON.stringify(value), redis.print);
}


function searchFromRedis(userid, tag){
	var table = 'test'
	var key = 'userdatajson'

	return new Promise(function(resolve, reject){
		
		client.hget(table, key, function (err, replies) {

			if(err){
				reject(err)
			}
    		//console.log(replies);
    		client.quit();


    		//search in json
    		var questioncount = 0;
    		var answercount = 0;
    		replies = JSON.parse(replies)
    		for(var reply of replies){
    			
    			if(reply.tagname == tag){
    				//console.log('tag details-->' +JSON.stringify(reply))
    				//console.log(reply.details.users[userid])
    				//console.log('user exists for this tag');
    				questioncount += reply.details.users[userid].questions.length
    				answercount+= reply.details.users[userid].answers.length
    				break;	
    			}
    		}

    		console.log('questioncount->' +questioncount)
    		console.log('answercount->' +answercount)
    		resolve(replies)
		});
	});
}

function normalize(score){

	//console.log(score)
	var min = 1;
	var max = 400;
    var range = max-min;
    var normalval = (score - min) / range;
    //console.log('normal value-->' +normalval)
    //% Then scale to [x,y]:
    var range2 = 5 - 1;
    var normalized = (normalval*range2) + min;
	return normalized;
	//return score;
}

function createMatrix(dbuserdata, usertagpostdatajson){

	var userarr = [];
	var tagflag = false;
	var userflag = false;
	var usernamearr = [];
	var tagnamearr = [];
	var count = 0;
	var ratingsStr = ''
 	for(var user of dbuserdata){
 		var tagsarr = []
 		var found = false
 		var tagcount = 0;
 		for(var tag of usertagpostdatajson){
 			
 			if(tag['details']['users'][user.OwnerUserId]){
 				//console.log('tag -->' + JSON.stringify(tag.details.users[user.Id]))
 				var activity = 0
 				var questioncount= tag['details']['users'][user.OwnerUserId]['questions'].length;
 				//console.log('questioncountfor user -->' + user.Id + ' -->' +  questioncount)
    			var answercount= tag['details']['users'][user.OwnerUserId]['answers'].length;
    			//console.log('answercount for user -->' + user.Id + ' -->' +  answercount)
    			activity = questioncount + 3*(answercount);
				console.log('un-normalized activity-->' +activity)
				activity = normalize(activity)
				console.log('normalized activity-->' +activity)
    			found = true;
    			tagsarr.push(activity);
    			if(ratingsStr==''){
    				//ratingsStr = count + ' ' + tagcount + ' ' + activity
    				ratingsStr = user.OwnerUserId + ' ' + tagcount + ' ' + activity
    			}else{
    				//ratingsStr += ('\n' + count + ' ' + tagcount + ' ' + activity)
    				ratingsStr += ('\n' + user.OwnerUserId + ' ' + tagcount + ' ' + activity)
    			}
    			
    			//process.exit();
			}else{
				tagsarr.push(0);
			}

			if(tagflag == false){
				tagnamearr.push(tag['tagname'])

				if(tagnamearr.length==usertagpostdatajson.length){
					tagflag = true;
				}
			}

			tagcount++;
 		}
 		//console.log('tag array length-->' +tagsarr.length)
 		if(found==true){
 			count++;
 			found = false;
 		}
 		//console.log('ratingsStr-->' + ratingsStr)
 		userarr.push(tagsarr);
 		usernamearr.push(user.OwnerUserId)
 	}

 	console.log('rating string->' +ratingsStr)
 	return [userarr, usernamearr, tagnamearr, ratingsStr];
}



async function searchRecommendations(){
 	console.log('function called');

 	var connection = await doConnect()
 	//console.log(connection);

 	var dbpostdata = await getPostsFromDB(connection);
 	//console.log('post data from db-->' +JSON.stringify(dbpostdata));

 	var usertagpostdatajson = getUserTagDataFromPosts(dbpostdata)
 	//console.log('usertagpostdatajson length-->' +usertagpostdatajson.length)

 	//save usertagpostdatajson in redis
 	saveInRedis('userdatajson', usertagpostdatajson, 'test')

 	//get user details
 	//var useractivity = await searchFromRedis('3', 'discussion');
 	//console.log('user activity for user id 1 is -->' +useractivity)

 	//store the entire thing in 2 d matrix
 	//get the users list
 	var dbuserdata = await getUsersFromDB(connection);
 	console.log('db user data-->' +JSON.stringify(dbuserdata))
 	var usertagitems = createMatrix(dbuserdata, usertagpostdatajson);

 	var usertagmatrix = usertagitems[0];
 	console.log(usertagmatrix.length + ' --' + usertagmatrix[0].length);
 	var userlist = usertagitems[1];
 	console.log(userlist.length);
 	var taglist = usertagitems[2];
 	console.log(taglist.length);
 	var ratingsStr = usertagitems[3]
 	saveInRedis('usertagmatrix', usertagmatrix, 'test');
 	saveInRedis('userlist', userlist, 'test');
 	saveInRedis('taglist', taglist, 'test');
 	saveInRedis('ratings', ratingsStr, 'test');
 	//console.log(userarr.length);
 	//console.log(userarr[1].length);
 	client.hget('test', 'ratings', function (err, replies) {
 		console.log(JSON.parse(replies));
 		//string = replies;
 		fs.writeFile('ratings.dat', JSON.parse(replies), function (err) {
  			if (err) return console.log(err);
  			console.log('written successfully');
		});
 	});
 	/*client.hget('test', 'userlist', function (err, replies) {
    	console.log(JSON.parse(replies)[0]);

    	client.hget('test', 'taglist', function (err, replies) {
	    	console.log(JSON.parse(replies)[1]);
	    	client.hget('test', 'usertagmatrix', function (err, replies) {
		    	console.log(JSON.parse(replies)[0][1]);
		    	client.quit();
			});
	    	//client.quit();
		});
    	//client.quit();
	});*/


 	connection.end();


}

//searchRecommendations()