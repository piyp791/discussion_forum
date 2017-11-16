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


function getCommentsFromDB(connection){

	var query = "Select * from Comments";

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
	var parentId = post.ParentID;
	/*if(post.ID == '905'){
		console.log(JSON.stringify(post))
		console.log('parent id-->' +parentId)	
	}*/
	for(var item of dbpostdata){
		if(item.ID == parentId){
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
		/*if(post.ID == '905'){
			console.log('getting paent tags')
		}*/
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
						item['details']['users'][userid]['questions'].push(postId);

						item['details']['users'][userid]['answers'] = []
						item['details']['users'][userid]['comments'] = []
						
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
						item['details']['users'][userid]['answers'].push(postId);
						
						item['details']['users'][userid]['questions'] = []
						item['details']['users'][userid]['comments'] = []
						
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
			tagobj['details'] = {'users':{}, 'questions':[], 'answers':[], 'comments': []}

			if(postType == '1'){
				//insert user details
				tagobj['details']['users'][userid] = {}
				tagobj['details']['users'][userid]['questions'] = []
				tagobj['details']['users'][userid]['questions'].push(postId);


				tagobj['details']['users'][userid]['answers'] = []
				tagobj['details']['users'][userid]['comments'] = []
	
				//insert post details
				tagobj['details']['questions'].push(post);					
			}else if(postType == '2'){
				//insert user details
				tagobj['details']['users'][userid] = {}
				tagobj['details']['users'][userid]['answers'] = []
				tagobj['details']['users'][userid]['answers'].push(postId);

				tagobj['details']['users'][userid]['questions'] = []
				tagobj['details']['users'][userid]['comments'] = []
				
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
 		/*if(post.ID == '905'){
 			console.log('tags -->' +tagsarr)
 		}*/
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


function searchInQuestions(postId, tag){

	for(var question of tag.details.questions){

		//console.log('question->' +JSON.stringify(question))
		//console.log('question id-->' +question.ID + '  post id-->' +postId )
		if(question.ID == postId){
			//console.log('post found!!!');
			return true;
		}

	}
	return false;
}

function searchInAnswers(postId, tag){

	for(var answer of tag.details.answers){

		if(answer.ID == postId){
			//console.log('post found!!!')
			return true;
		}
		
	}
	return false;
}

function addCommentToJSON(comment, usertagpostdatajson){

	var postId = comment.PostId;
	var userId = comment.UserId;
	var commentId = comment.Id;
	
	for(var tag of usertagpostdatajson){

		//console.log('searching for tag-->' +tag.tagname)

		if(searchInQuestions(postId, tag) || searchInAnswers(postId, tag)){
			
			//console.log('tag found !!!!')

			//console.log('user id -->' +userId)
			//add comment information to tag
			//console.log(tag['tagname'] + '-->' +JSON.stringify(tag['details']['users'][userId]))
			
			if(tag['details']['users'][userId]){
				tag['details']['users'][userId]['comments'].push(commentId)
			}else{
				//console.log('creating user entry for this tag')

				tag['details']['users'][userId] = {};
				tag['details']['users'][userId]['questions'] = []
				tag['details']['users'][userId]['answers'] = []
				tag['details']['users'][userId]['comments'] = []
				tag['details']['users'][userId]['comments'].push(commentId)

			}
			
		}
	}

	return usertagpostdatajson;
}



function addCommentsToPostJSON(dbcommentdata, usertagpostdatajson){

	//iterate over all comments
		//get tags of comments
		//add info to each tag
	for(var comment of dbcommentdata){

		//console.log('comment ->' +comment.Id)
		addCommentToJSON(comment, usertagpostdatajson);
	}

	return usertagpostdatajson

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
	/*if(score>150){
		score = 150;
	}*/
	/*var min = 1;
	var max = 150;
    var range = max-min;
    var normalval = (score - min) / range;
    //console.log('normal value-->' +normalval)
    //% Then scale to [x,y]:
    var range2 = 5 - 1;
    //var normalized = Math.round((normalval*range2) + min  );
 	var normalized = (normalval*range2) + min;
	return normalized;*/
	return score;
}

function calculateActivity(questioncount, answercount, commentcount, userid){

	console.log('user id --> ' +  userid  + ' questioncount-->' +questioncount + '  answercount-->' +answercount + '  commentcount->' +commentcount )

	//get all answers for user
	//get all comments for user
	//get all questions for user


}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}


function createMatrix(dbuserdata, usertagpostdatajson){

	var userarr = [];
	var tagflag = false;
	var userflag = false;
	var usernamearr = [];
	var tagnamearr = [];
	var count = 0;
	var ratingsStr = '';
	var questionarr = []
	var answerarr = []
	var orgact = [];

	var userObj = {};
 	for(var user of dbuserdata){

 		var userDetails = {'questions': [], 'answers':[], 'comments':[]}

 		var tagsarr = []
 		var found = false
 		var tagcount = 0;
 		for(var tag of usertagpostdatajson){
 			
 			if(tag['details']['users'][user.OwnerUserId]){
 				//console.log('tag -->' + JSON.stringify(tag.details.users[user.Id]))
 				var activity = 0

 				var questioncount= tag['details']['users'][user.OwnerUserId]['questions'].length;
 				questionarr.push(questioncount)
 				userDetails.questions = arrayUnique(userDetails.questions.concat(tag['details']['users'][user.OwnerUserId]['questions']));
 				//console.log('question count for user -->' + user.OwnerUserId + ' for tag -->'  +  tag['tagname']  + ' -->' +  questioncount);
    			
    			var answercount= tag['details']['users'][user.OwnerUserId]['answers'].length;
    			answerarr.push(answercount)
    			userDetails.answers = arrayUnique(userDetails.answers.concat(tag['details']['users'][user.OwnerUserId]['answers']));
    			//userDetails.answers+=answercount
    			//console.log('answer count for user -->' + user.OwnerUserId + ' -->' + tag['tagname'] + '-->' +   answercount)

				var commentcount= tag['details']['users'][user.OwnerUserId]['comments'].length;
    			answerarr.push(commentcount)
    			userDetails.comments = arrayUnique(userDetails.comments.concat(tag['details']['users'][user.OwnerUserId]['comments']));
    			//console.log('comment count for user -->' + user.OwnerUserId + ' -->' + tag['tagname'] + '-->' +   commentcount)


    			orgact.push((questioncount+answercount + commentcount))
    			activity = (0.5*questioncount) + (2*answercount) + (1*commentcount);
				//console.log('un-normalized activity-->' +activity)
				activity = calculateActivity(questioncount, answercount, commentcount, user.OwnerUserId);
				//activity = normalize(activity)
				//console.log('normalized activity-->' +activity)
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

 		userObj[user.OwnerUserId] = userDetails;
 	}

 	//console.log('rating string->' +ratingsStr)
 	return [userarr, usernamearr, tagnamearr, ratingsStr, questionarr, answerarr, orgact, userObj];
}

function calculateScore(postcount, totalpostcount, posttype){

	//console.log('postcount-->' +postcount + ' totalpostcount-->' +totalpostcount + ' posttype-->' +posttype)
	var score = 0;
	if(totalpostcount!=0){

		score = (postcount/totalpostcount)*(postcount)
	}
	
	if(posttype == 1){

		//question
		score *=2

	}else if(posttype==2){

		score *=4

	}else if(posttype ==3){

		score *=3

	}
	//console.log('score-->' +score)
	return score

}

function calculateActivityScores(userObj, dbuserdata, usertagpostdatajson){

	var ratingsStr = ''
	for(var user of dbuserdata){

		var tagcount = 0;
		for(var tag of usertagpostdatajson){

			if(tag['details']['users'][user.OwnerUserId]){

				var questioncount= tag['details']['users'][user.OwnerUserId]['questions'].length;
				var answercount= tag['details']['users'][user.OwnerUserId]['answers'].length;
				var commentcount= tag['details']['users'][user.OwnerUserId]['comments'].length;

				var questionScore = calculateScore(questioncount, userObj[user.OwnerUserId]['questions'].length, 1 )
				
				var answerScore = calculateScore(answercount, userObj[user.OwnerUserId]['answers'].length, 2 )
				var commentScore = calculateScore(commentcount, userObj[user.OwnerUserId]['comments'].length, 3 )

				if(user.OwnerUserId == '21790'){
					console.log(tag.tagname + ' -->  ' +questioncount + ' --' + answercount + '--' + commentcount + ' ------>' +questionScore + '-->' + answerScore + ' -->' +commentScore);	
				}

				var activity = questionScore + answerScore + commentScore

				/*if(activity>=4){
					activity = 4 + 1/(1+Math.pow(Math.E, -activity) + ((activity-4)/10));

				}*/

				if(ratingsStr==''){
    				//ratingsStr = count + ' ' + tagcount + ' ' + activity
    				ratingsStr = user.OwnerUserId + ' ' + tagcount + ' ' + activity
    			}else{
    				//ratingsStr += ('\n' + count + ' ' + tagcount + ' ' + activity)
    				ratingsStr += ('\n' + user.OwnerUserId + ' ' + tagcount + ' ' + activity)
    			}
			}
			tagcount++;
		}
	}
	return ratingsStr
}



async function searchRecommendations(){
 	console.log('function called');

 	var connection = await doConnect()
 	//console.log(connection);

 	var dbpostdata = await getPostsFromDB(connection);
 	//console.log('post data from db-->' +JSON.stringify(dbpostdata));

 	var dbcommentdata = await getCommentsFromDB(connection);
 	//console.log('comment data from db-->' +JSON.stringify(dbcommentdata));

 	var usertagpostdatajson = getUserTagDataFromPosts(dbpostdata)
 	//console.log('usertagpostdatajson length-->' +JSON.stringify(usertagpostdatajson))

 	var usertagpostdatajson = addCommentsToPostJSON(dbcommentdata, usertagpostdatajson)
 	//console.log('usertagpostdatajson-->' +JSON.stringify(usertagpostdatajson))
 	
 	//save usertagpostdatajson in redis
 	saveInRedis('userdatajson', usertagpostdatajson, 'test')

 	//get user details
 	//var useractivity = await searchFromRedis('9058', 'community-wiki');
 	//console.log('user activity for user id 1 is -->' +JSON.stringify(useractivity))

 	//store the entire thing in 2 d matrix
 	//get the users list
 	

 	var dbuserdata = await getUsersFromDB(connection);
 	//console.log('db user data-->' +JSON.stringify(dbuserdata))
 	var usertagitems = createMatrix(dbuserdata, usertagpostdatajson);

 	var usertagmatrix = usertagitems[0];
 	//console.log(usertagmatrix.length + ' --' + usertagmatrix[0].length);
 	

 	var userlist = usertagitems[1];
 	console.log(userlist.length);
 	var taglist = usertagitems[2];
 	console.log(taglist.length);
 	var ratingsStr = usertagitems[3];
 	var questionarr = usertagitems[4];
 	var answerarr = usertagitems[5];
 	var orgact = usertagitems[6];
 	var userObj = usertagitems[7];

 	//calculate user ratings
 	ratingsStr = calculateActivityScores(userObj, dbuserdata, usertagpostdatajson);

 	//console.log('questioncount-->' +questionarr)
 	//console.log('questioncount-->' +answerarr)
 	//console.log('userObj-->' +JSON.stringify(userObj))
 	saveInRedis('usertagmatrix', usertagmatrix, 'test');
 	saveInRedis('userlist', userlist, 'test');
 	saveInRedis('taglist', taglist, 'test');
 	saveInRedis('ratings', ratingsStr, 'test');
 	saveInRedis('orgact', orgact, 'test');

 	//console.log(userarr.length);
 	//console.log(userarr[1].length);
 	client.hget('test', 'ratings', function (err, replies) {
 		//console.log(JSON.parse(replies));
 		//string = replies;
 		fs.writeFile('ratings.dat', JSON.parse(replies), function (err) {
  			if (err) return console.log(err);
  			console.log('written successfully');

  			fs.writeFile('scripts/ratings.dat', JSON.parse(replies), function (err) {
  				if (err) return console.log(err);
  				console.log('written successfully');
			});
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

searchRecommendations()