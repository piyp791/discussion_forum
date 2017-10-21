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


  		if(preference == 'trending'){

  			var previousDate = new Date();
  			previousDate.setDate(1);
  			previousDate.setMonth(previousDate.getMonth()-8);

  			var currentDate = new Date()
  			
  			var query = "select * from Posts where PostTypeId = 1 and CreationDate between '" + previousDate.toISOString() + "'  and  '" + currentDate.toISOString() + "'  order by ViewCount desc limit 10;"
  			
  		}else if(preference == 'top ten'){

  			var query = "select * from Posts where PostTypeId = 1 order by ViewCount desc limit 10;"

  		}else if(preference == 'latest'){

  			var query = "select * from Posts where PostTypeId = 1 order by CreationDate desc limit 10;"
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

  	},

  	isUserVerified: function(userid, callback){

  		if(!connection){
  			connection = connect()
  		}

  		var query = "select count(*) as 'usercount' from Users where Id = " + userid;
  		console.log('query-->' +query);

  		connection.query(query, function(err, result, fields){

  			if(err){
  				console.log(err)
  				callback(err, null)
  			}
  			console.log('number of rows returned -->' +JSON.stringify(result));
			if(result[0].usercount == 0){
				console.log('callback with err called')
				callback(null, false)
			}else{
				callback(null, true)
			}

  		});
  	},

  	getUserInfo: function(userid, callback){

  		if(!connection){
  			connection = connect();
  		}

  		var query = "select * from Users where Id = " + userid;
  		console.log('query-->' +query);

  		connection.query(query, function(err, result, fields){

  			if(err){
  				console.log(err);
  				callback(err, null);
  			}
  			console.log('number of rows returned -->' +JSON.stringify(result));
			if(result.length == 0){
				console.log('callback with err called');
				callback(null, false);
			}else{
				callback(null, result);
			}
  		});
  	},

  	getUserActivity: function(userid, filtervalue, sortvalue, postval, callback){

  		if(!connection){
  			connection = connect();
  		}

      var corequery = "select * from Posts";

      var condition = " where OwnerUserId = " + userid;

      if(filtervalue!= "" && filtervalue){
        condition += " && Tags like %\"" + filtervalue + "\"%";
      }
      if(postval!= "" && postval){
        condition += " && PostTypeId = " + postval;
      }


      var order = ""
      if(sortvalue == "Popularity"){

        order = " order by ViewCount desc";

      }else if(sortvalue == "Newest"){

        order = " order by CreationDate desc";

      }else if(sortvalue == "Oldest"){

          order = " order by CreationDate asc";

      }else{
        //something default
      }

      limit = " limit 10";

      var query = corequery + condition + order + limit;
  		console.log('query-->' +query);

  		connection.query(query, function(err, result, fields){

  			if(err){
  				console.log(err);
  				callback(err, null);
  			}
  			console.log('number of rows returned -->' +JSON.stringify(result));
  			if(result.length == 0){
  				console.log('callback with err called');
  				callback(null, false);
  			}else{
  				callback(null, result);
  			}
  		});
  	}
}