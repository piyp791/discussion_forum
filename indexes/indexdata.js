var fs = require('fs')
var parser = require('xml2json');
/*var lunr = require('lunr');*/

var elasticsearch = require('elasticsearch');
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
});


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


client.search({
  index: 'se',
  q: 'content:moderator election'
}, function (error, response) {
  	console.log('response=-->' + response)
});





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