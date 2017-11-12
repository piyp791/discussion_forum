var fs = require('fs')
var parser = require('xml2json');
/*var lunr = require('lunr');*/

/*var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});*/


/*var contents = fs.readFileSync(__dirname + '/../data/apple.meta.stackexchange.com/Posts.xml', 'utf8');
//console.log(contents)
var documents = parser.toJson(contents);
documents = JSON.parse(documents);
documents = documents.posts.row;
console.log('number of dicuments -->' +documents.length)

var total_length = 0
for(var i=0;i<14;i++){
	doc_array = documents.slice(i*200, (i+1)*200);
	total_length +=doc_array.length
	console.log(doc_array.length + ' -->' + total_length)
	//fs.writeFileSync(__dirname + '/data/data-' + i + '.json', JSON.stringify(doc_array));
}

doc_array = documents.slice(2800, documents.length)
total_length +=doc_array.length
console.log(doc_array.length + ' -->' + total_length)
//fs.writeFileSync(__dirname + '/data/data-14.json', JSON.stringify(doc_array));
*/



//delete  index
/*client.indices.delete({index: 'se'},function(err,resp,status) {  
  console.log("delete",resp);

  //create index
	client.indices.create({ index: 'se'},function(err,resp,status) {
		  if(err) {
		    console.log(err);
		  }
		  else {
		    console.log("create",resp);
		}
	});
});*/


/*var data = fs.readFileSync(__dirname + '/data/data-14.json', 'utf8');

var documents = JSON.parse(data)

//documents = documents.slice(0, 200);

documents.forEach(function(obj){

	doc = {}

	var postid = obj['Id']
	var postType = obj['PostTypeId'];

	if(postType== '1'){
		var posttitle  = obj['Title'];
		posttitle = posttitle.replace(/[^\x00-\x7F]/g, " ");
	}else{
		var posttitle = 'NA'
	}

	var postbody = obj['Body'];
	postbody = postbody.replace(/[^\x00-\x7F]/g, " ");

	console.log('post id -->' +postid);
	console.log('post typ e-->' +postType);
	console.log('post title->' +posttitle);
	console.log('post bosy->' +postbody)

	 client.create({
	 	index: 'se',
        id: postid,
        type: postType,
        body: {'title': posttitle, 'content': postbody}
     }, function(error, response){
     	if(error){
     		console.log('error-->' + error);
     		process.exit();
     	}else{
     		console.log('added successfully')
     	}
     });
});*/



/*var postid = 3126
var postType = 2
var posttitle = "NA"
var postbody =  "<p>The editing is mostly a way to avoid a large period of time where people would be inclined to down vote as opposed to remedy past impressions. Ideally, each edit would then ping the voters or come back and revisit their expression - but without that, there s still the chance that everyone else will see the edited post and help right the down votes if the edit fixes whatever issues existed.</p>\n"


client.create({
	 	index: 'se',
        id: postid,
        type: postType,
        body: {'title': posttitle, 'content': postbody}
     }, function(error, response){
     	if(error){
     		console.log('error-->' + error);
     		process.exit()
     	}else{
     		console.log('added successfully')
     	}
     });
*/


//count docs
/*client.count({
	  index: 'se'
	}, function (error, response) {
	  // ...
	  console.log('count response -->' +JSON.stringify(response))
});*/




/*client.bulk({
  body: documents
}, function (err, resp) {
  	console.log('documents added')
});*/


/*client.search({
  index: 'df',
  q: 'content:discussion,tags,osx,poo-storm,site-scope'
}, function (error, response) {
  	console.log('response=-->' + response)
});*/





/*client.search({
  index: 'se',
  body: {
    query: {
      match: {
        body: {'content': 'java'}
      }
    }
  }
}).then(function (resp) {
    var hits = resp.hits.hits;
}, function (err) {
    console.trace(err.message);
});*/


/*client.count({
	  index: 'se'
	}, function (error, response) {
	  // ...
	  console.log('count response -->' +JSON.stringify(response))
});*/

//var storedindex = JSON.stringify(idx);
//fs.writeFileSync(__dirname + '/index.json', storedindex);

//test search the data
/*var fileindex = fs.readFileSync(__dirname + '/index.json', 'utf8');
var new_idx = lunr.Index.load(JSON.parse(fileindex));

 //results = idx.search(query);
 results = new_idx.search("sponsoring a member of the Apple community to speak at a conference in 2011");
 console.log('results -->' + JSON.stringify(results))*/


//index data


//calculate similarity
/*var vector1 = new lunr.Vector({'id': 1, 'text': 'this is a sample text from document in the whole corpus.'}, {'id': 2, 'text': 'this is not a regular document.'});
var vector2 = new lunr.Vector({'id': 2, 'text': 'this is not a regular document.'});

var similarity = vector1.similarity(vector2);
console.log('similarity-->' + similarity);*/
/*
## dict[user][tag] = activity_rating
# users_list = []
# tag_list = []
# for each userid in userids:   <- i
#   for each tag in tags: <- j
#     
#     get list of question ids for that ownerid with posttypeid = 1 and tag  = this tag
#     store length of question id list
#     get list of answers for that ownerid where parent tag  = this tag
#     store length of answers list
#     total activity_rating of this user for this tag = 3*answer + question.
#     user_rating[i][j] = activity_rating
#     tag_list.push(tag)
#   users_list.push(userid) */





/*

var Recommender = require('likely');

books = {1: {'tag': 4, 'discussion': 5, 'meta': 10}, 
        2: {'tag': 3, 'discussion': 2}}

tags = ['tag', 'discussion', 'meta', 'random']
users = ['-1', '2', '10']

var inputMatrix = [ [ 1, 2, 5, 3 ],
                    [ 10, 0, 10, 0 ],
                    [ 3, 5, 0, 0 ]];

//var Model = Recommender.buildModel(inputMatrix, users, tags);
var bias = Recommender.calculateBias(inputMatrix);
var Model = Recommender.buildModelWithBias(inputMatrix, bias, users, tags);

var recommendations = Model.recommendations('10');
console.log('recommendations-->' +recommendations);

var allItems = Model.rankAllItems('2');
console.log('all items-->' +allItems);*/



var redis = require("redis"),
client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});


var contents = fs.readFileSync(__dirname + '/../data/apple.meta.stackexchange.com/Users.xml', 'utf8');
//console.log(contents)
var userdocs = parser.toJson(contents);
userdocs = JSON.parse(userdocs);
userdocs = userdocs.users.row;
console.log('number of users -->' +userdocs.length)


var tags = fs.readFileSync(__dirname + '/../data/apple.meta.stackexchange.com/Tags.xml', 'utf8');
//console.log(contents)
var tagdocs = parser.toJson(tags);
tagdocs = JSON.parse(tagdocs);
tagdocs = tagdocs.tags.row;
console.log('number of tags -->' +tagdocs.length)

var posts = fs.readFileSync(__dirname + '/../data/apple.meta.stackexchange.com/Posts.xml', 'utf8');
//console.log(contents)
var postdocs = parser.toJson(posts);
postdocs = JSON.parse(postdocs);
postdocs = postdocs.posts.row;
console.log('number of posts -->' +postdocs.length);

var count = 0
/*
var userarr = []
var useridarr = []
var tagslabelarr = []
for (var i=0;i<userdocs.length ;i++){
  var userid = userdocs[i].Id

  var tagsarr = []
  tagslabelarr = []
  console.log('userid-->' +userid)

  //userTagRating = 
  for(var j=0;j<tagdocs.length;j++){

    var useractivity = 0;
    var questioncount = 0;
    var answercount = 0;

    for(var k=0;k< postdocs.length;k++){

      //console.log('post type id-->' +postdocs[k].PostTypeId + ' postid-->' +postdocs[k].Id)

      if(postdocs[k].PostTypeId == '1' && postdocs[k].OwnerUserId == userid  && postdocs[k].Tags.includes(tagdocs[j].TagName)){

        questioncount++;

      }else if(postdocs[k].PostTypeId == '2' && postdocs[k].OwnerUserId == userid){

        var parentId = postdocs[k].ParentId;

        //find parent post and its tag
        for(var l=0;l< postdocs.length;l++){

          if(postdocs[l].Id == parentId && postdocs[l].Tags.includes(tagdocs[j].TagName)){
            answercount++;
          }
        }
      }
    } //end of post loop

    useractivity = 2.5*answercount + questioncount;
    tagsarr.push(useractivity)
    tagslabelarr.push(tagdocs[j].TagName)

    if(useractivity!=0){
      count++
    }
    //console.log('questioncount-->' +questioncount +  '  answercount--> '  +answercount  + ' for user ' + userid   + ' for tag -->' +tagdocs[j].TagName)

  } //end of tag loop
  userarr.push(tagsarr);
  useridarr.push(userid);
  
} //end of user loop

console.log('final array->' +userarr);
console.log('tagslabelarr-->' +tagslabelarr);
console.log('useridarr-->' +useridarr);

*/
//client.set("string key", "string val", redis.print);
client.hset("matrix", "2", JSON.stringify([[1,2,3,4], [5,6,7,8]]), redis.print);
client.hset("matrix", "1", JSON.stringify([[3,1,2,4], [6,7,8,8]]), redis.print);
//client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hgetall("matrix", function (err, replies) {
    console.log(replies);
    client.quit();
});