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

  	getHomePageLinks: function(preference, userid, callback){


      console.log('get Home page links::::userid-->' +userid)

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

  		}else if(preference == 'recommended'){
  
        var query = "select * from Posts"

        if(userid != -1){

            query +=" where OwnerUserId = " +userid
        }

  		}else{
        //oh crap

        //some tag
        console.log('preference-->'+preference)
        var query = "select * from Posts where "
        var preferenceArr  = preference.split(',');
        var tagstring = ''
        for(var tag of preferenceArr){
          if(tagstring==''){
            tagstring= " Tags like '%" + tag + "%'"  
          }else{
            tagstring+= " or Tags like '%" + tag + "%'"
          }
        } 
        query+= tagstring + " order by ViewCount desc limit 10"         
      }

  		console.log("Query -->" + query);
  		connection.query(query, function (err, result, fields) {
  			if (err){
  				console.log(err)
  				callback(err, null)
  			} 
  			//console.log('number of rows returned -->' +JSON.stringify(result));
  			if(result.length == 0){
  				console.log('callback with err calleed');
  				callback(null, false);
  			}else{
  				callback(null, result);
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

    storeHighlightDetails: function(title, text, parentID, callback){

      if(!connection){
        connection = connect();
      }

      title = title.replace(/"/g,"")
      console.log('title-->' +title)

      var query = "INSERT INTO Highlights (Title, Text, NumOfHighlights, ParentID) VALUES (\"" + title + "\", \"" + text +"\", 1, \""  + parentID + "\") ON DUPLICATE KEY UPDATE NumOfHighlights = NumOfHighlights + 1"

      //var query = "Replace into Highlights set Title = \"" +title + "\", Text = \"" + text + "\", NumOfHighlights = NumOfHighlights + 1"; 

      //query = "insert into Highlights(Title, Text) values(\"" + title + "\",\"" + text + "\")"
      console.log('query-->' +query)

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

    getHighlights: function(title, callback){

      if(!connection){
        connection = connect();
      }

      title = title.replace(/"/g,"");
      console.log('title-->' +title);
      //str = str.replace(/abc/g, '');
		var query = "SELECT Highlights.ID, Highlights.Title, Highlights.Text, Highlights.NumOfHighlights, Highlights.ParentID,   Highlights_Comments.Comment FROM Highlights LEFT JOIN Highlights_Comments ON Highlights.Title=Highlights_Comments.Title and Highlights.Text=Highlights_Comments.Text where Highlights.Title = \"" +title + "\" order by Highlights.ID";

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

    getPageLinks: function(questionid){
        return new Promise(function(resolve, reject){

          if(!connection){
            connection = connect();
          }

          var query = "select * from Link_Store where PostID = " +questionid;
          console.log('query-->' +query);

          connection.query(query, function(err, result, fields){
            if(err){
              console.log(err);
              resolve([])
            }

            console.log('number of rows returned -->' +JSON.stringify(result));
            resolve(result)
          });
      })
    },

    addCommentOnHighlight: function(comment, title, text, callback){
        if(!connection){
            connection = connect();
        }

        title = title.replace(/"/g,"");
        console.log('title-->' +title);

        var query = "INSERT INTO Highlights_Comments (Title, Text, Comment) VALUES (\"" + title + "\", \"" + text +"\", \"" + comment +"\")";

        //var query = "Replace into Highlights set Title = \"" +title + "\", Text = \"" + text + "\", NumOfHighlights = NumOfHighlights + 1";

        //query = "insert into Highlights(Title, Text) values(\"" + title + "\",\"" + text + "\")"
        console.log('query-->' +query)

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

      var corequery = ""
      var condition = ""
      var order = ""

      if(postval=='1'){

        corequery = "select * from Posts";

        condition = " where OwnerUserId = " + userid;

        if(filtervalue!= "" && filtervalue){
          condition += " and Tags like \"%" + filtervalue + "%\"";
        }
        
        condition += " and PostTypeId = " + postval

        
        if(sortvalue == "Popularity"){

          order = " order by ViewCount desc";

        }else if(sortvalue == "Newest"){

          order = " order by CreationDate desc";

        }else if(sortvalue == "Oldest"){

            order = " order by CreationDate asc";

        }else{
          //something default
        }

      }else if(postval =='2'){

          corequery = "Select A.Title, A.Tags, B.ID, B.PostTypeId, B.ParentID, B.CreationDate, B.Score, B.Body, B.OwneruserId from Posts A , Posts B";

          condition = " where B.OwnerUserId = " + userid;

          condition+= " and A.ID = B.ParentID";

          if(filtervalue!= "" && filtervalue){
            condition += " and A.Tags like \"%" + filtervalue + "%\"";
          }
        
          condition += " and B.PostTypeId = " + postval

          if(sortvalue == "Newest"){

            order = " order by B.CreationDate desc";

          }else if(sortvalue == "Oldest"){

            order = " order by B.CreationDate asc";

          }else{
            //something default
          }

      }

      limit = " limit 10";

      var query = corequery + condition + order + limit;
  		console.log('query-->' +query);

  		connection.query(query, function(err, result, fields){

  			if(err){
  				console.log(err);
  				callback(err, null);
  			}
  			//console.log('number of rows returned -->' +JSON.stringify(result));

        callback(null, result)
  			/*if(result.length == 0){
  				console.log('no rows'); 
  				callback(null, false);
  			}else{
  				callback(null, result);
  			}*/
  		});
  	}
}