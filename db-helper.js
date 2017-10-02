//var mysql = require('mysql');
var conf = require('./config');
var mysql = require('mysql');

var connection;

module.exports = {

	connect: function(callback){

		console.log('data base connection established....')

		if(!connection){
			connection = mysql.createConnection({
		  		host     : conf.app.dbUri,
		  		user     : conf.app.dbUser,
		  		password : conf.app.dbPassword,
		  		database: "forum_db"
			});	
			
			connection.connect(function(err){
				if(err){
					callback(err, null);
				}else{
					callback(null, true)
				}
			});
		}
  	},

  	getHomePageLinks: function(preference, callback){

  		if(!connection){
  			connection = connect()
  		}


  		if(preference == 'latest'){
  			
  			

  		}else if(preference == 'top ten'){

  		}else if(preference == 'random'){

  			var query = "select title from Posts where PostTypeId = 1 LIMIT 10;" 
  		}else{
  			//oh crap!!!

  		}

		console.log("Query -->" + query)
		connection.query(query, function (err, result, fields) {
			if (err){
				console.log(err)
				callback(err, null)

			} 
			console.log('number of rows returned -->' +JSON.stringify(result));
			if(result.length == 0){
				console.log('callback with err calleed')
				callback(null, false)
			}else{
				callback(null, result)
			}
		});

  	}
}