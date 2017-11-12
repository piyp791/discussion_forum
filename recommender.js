var Recommender = require('likely');
var redis = require("redis");
client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

var rows = 5000;
var cols = 100;
var outer = new Array(rows)
for(var i=0;i<rows;i++){
	var inner = new Array(cols)
	for(var j=0;j<cols;j++){
		inner[j] = Math.floor((Math.random() * 10) + 1);
	}
	outer[i] = inner
}

console.log('matrix created....' + outer.length + ' --' + outer[0].length)

var Model = Recommender.buildModel(outer);
console.log('model created...')

/*client.hget('test', 'userlist', function (err, userlist) {
    	//console.log(JSON.parse(userlist));

    	client.hget('test', 'taglist', function (err, taglist) {
	    	//console.log(JSON.parse(taglist));
	    	client.hget('test', 'usertagmatrix', function (err, usertagmatrix) {
		    	//console.log(JSON.parse(usertagmatrix));

		    	var Model = Recommender.buildModel(usertagmatrix, userlist, taglist);
		    	console.log('completed!!')
		    	client.quit();
			});
	    	//client.quit();
		});
    	//client.quit();
	});*/