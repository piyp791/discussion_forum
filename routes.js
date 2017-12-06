var express = require('express');
var dbHelper = require('./db-helper');
var misc = require('./misc');
var redisHelper = require('./redis_store');

module.exports = function(app) {

    app.use(express.static('public'));

    app.get('/home', function(req, res){

        //get links from db
        dbHelper.getHomePageLinks('trending', -1, function(err, data){
            if(err){
                console.log('some error!!');
                res.render('home.ejs', {'homePageContent': 'hahahahahaha'});

            }else{
                res.render('home.ejs', {'homePageContent': JSON.stringify(data)});
            }
        });
    });

    app.get('/getPreferences/:userid', function(req, res){

        var userid = req.params.userid;

        //get user tags
        misc.getPreferences(userid, function(err ,data){

            console.log('data-->' +JSON.stringify(data));
            if (JSON.stringify(data) == "{}"){
                misc.getUserTags(userid, function(err, data){

                    console.log('getting user tags');
                    res.render('preferences.ejs', {'tags': JSON.stringify(data), 'history':[]});
                });
            }else{
                res.render('preferences.ejs', {'tags': JSON.stringify(data), 'history':[]});
            }

        });
    });

    app.get('/getUserPreferences/:userid', function(req, res){

        //get user tags
        var userid = req.params.userid;
        misc.getPreferences(userid, function(err ,data){

            console.log('data-->' +JSON.stringify(data));
            if (JSON.stringify(data) == "{}"){
                misc.getUserTags(userid, function(err, data){

                    console.log('getting user tags');
                    res.json({'tags': JSON.stringify(data), 'history':[]});
                });
            }else{
                res.json({'tags': JSON.stringify(data), 'history':[]});
            }

        });
    });

    app.get('/getUserTags/:userid', function(req, res){

        var userid = req.params.userid;

        misc.getUserTags(userid, function(err, data){

            console.log('user tags-->' +JSON.stringify(data));
             if (JSON.stringify(data) == "{}"){
                misc.getUserTags(userid, function(err, data){

                    console.log('getting user tags');
                    res.json({'tags': JSON.stringify(data), 'history':[]});
                });
            }else{
                res.json({'tags': JSON.stringify(data), 'history':[]});
            }

        });
    })

    app.get('/getlatest', function(req, res){

        dbHelper.getHomePageLinks('latest', -1, function(err, data){
            if(err){
                console.log('some error!!');
                res.json({'content': 'hahahahahaha'})

            }else{
                res.json(JSON.stringify(data))
            }
        });
    });

    app.get('/getPageLinks/:questionid', function(req, res){

        var questionId = req.params.questionid;
        misc.getPageLinks(questionId, function(err, links){
            res.json(JSON.stringify(links));
        });
    });

    app.post('/savePreferences', function(req, res){

        var preferences = req.body.preferences;
        var userId = req.body.userid;
        console.log('saving user preferences-->' +JSON.stringify(preferences));
        console.log('saving userid-->' +userId);
        misc.savePreferences(preferences, userId, function(err, result){
            res.json({'status': 'success'})
        });
    });

    app.get('/getrecommended/:userid', function(req, res){

        var userid = req.params.userid;

        if(!userid){
            res.json(JSON.stringify({'status': 'failure'}))
        }

        misc.getPreferences(userid, function(err, preferences){
            if(JSON.stringify(preferences) == "{}"){

                misc.getUserTags(userid, function(err, tags){

                    console.log('user tags-->' +JSON.stringify(tags));

                    var preferences = {};
                    preferences['tags'] = {};
                    for(let tag of tags){
                        preferences['tags'][tag] = 1;
                    }

                    preferences['source'] = {};

                    preferences['source']['content'] = 0.5;
                    preferences['source']['cf'] = 0.5;

                    console.log('preferences-->' +JSON.stringify(preferences));

                    misc.getContentBasedResults(userid, preferences, function(err, contentPosts){

                        console.log('content based results -->' +JSON.stringify(contentPosts));

                        misc.getCollaborativeResults(userid, function(err, collaborativePosts){

                            console.log('collaborative filtering results -->' +JSON.stringify(collaborativePosts));
                            res.json({'content': contentPosts, 'cf': collaborativePosts});
                        });
                    });
                });
            }else{
                misc.getContentBasedResults(userid, preferences, function(err, contentPosts){

                    console.log('content based results -->' +JSON.stringify(contentPosts));

                    misc.getCollaborativeResults(userid, function(err, collaborativePosts){

                        console.log('collaborative filtering results -->' +JSON.stringify(collaborativePosts));
                        res.json({'content': contentPosts, 'cf': collaborativePosts});
                    });
                });
            }
        })


    });

    app.get('/page/:link', function(req, res){

        var linkTitle = req.params.link;
        console.log('link title -->' +linkTitle)

        res.render('posts/' + linkTitle + ".ejs")

    });

    app.get('/login-page', function(req, res){

        var action = req.query.action;
        console.log('action-->' +action)

        res.render('login.ejs', {'action': action})

    });

    app.post('/login', function(req, res){

        var userid = req.body.userid;
        dbHelper.isUserVerified(userid, function(err, data){

            if(err){
                console.log('some error!!');
            }else{
                console.log('data-->' +JSON.stringify(data))
                if(JSON.stringify(data) == 'false'){
                    res.json({'isverified': false})    
                }else{
                    res.json({'isverified': true})
                }
                
            }
        })
    });

    app.post('/commentOnHighlight', function(req, res){

        var comment = req.body.comment;
        var title = req.body.title;
        var text = req.body.text;

        console.log('comment-->' +comment);
        console.log('title-->' +title);
        console.log('text-->'+text);

        dbHelper.addCommentOnHighlight(comment, title, text, function(err, data){

            if(err){
                console.log('some error!!');
            }else{
                res.json({'status': 'success'});
            }
        });
    });


    app.get('/users/id/:userid', function(req, res){
        var userid = req.params.userid;

        console.log('user id -->' +userid);
        try{
            userid = parseInt(userid);

             //get user info from database
            dbHelper.getUserInfo(userid, function(err, data){

            if(err){
                console.log('some error!!');
            }else{
                console.log('user data-->' +JSON.stringify(data))
                /*if(JSON.stringify(data) == 'false'){
                    res.JSON({'status': 'Not verified'})
                }else{*/
                    res.render('profile.ejs', {'userinfo': data})   
                //}
                     
            }
         });
        }catch(err){
            console.log(err)
            res.json({'response': 'empty'})  
        }
        
    });

    app.get('/activity/:userid', function(req, res){

        var userid = req.params.userid;
        console.log('user id -->' +userid);

        var sortval = req.query.sort==undefined?'':req.query.sort;
        var tagval = req.query.tag==undefined?'':req.query.tag;
        var posttype = (req.query.postType==undefined || req.query.postType=='Questions') ?'1':'2';
        console.log('sort value-->' +sortval + ' filter value-->' +tagval + '  posttype value-->' + posttype);

        try{
            userid = parseInt(userid);

            //get user info from database
            dbHelper.getUserActivity(userid, tagval, sortval, posttype, function(err, data){

                if(err){
                    console.log('some error!!');
                }else{
                    //console.log('user data-->' +JSON.stringify(data))
                    res.json(data)        
                }
             });
        }catch(err){
            console.log(err);
            res.json({'response': 'empty'});  
        }
    });

    app.post('/reportIssue', function(req, res){

        var issue = req.body.issue;
        console.log('issue-->' +issue);

        var spawn = require("child_process").spawn;
        var process = spawn('python',["todoist.py", issue]);

        process.stdout.on('data', function (data){
            // Do something with the data returned from python script

            console.log('ho ho...some thing came back' + data);
            res.json({'status': 'success'})
        });
    })

    app.get('/ask', function(req, res){
        res.render(__dirname + "/views/" + "ask.ejs");
    });

    app.post('/highlight', function(req, res){

        var title = req.body.title;
        var text = req.body.text;
        var parentID = req.body.parentID;

        console.log('title-->' + title);
        console.log('text-->' +text);
        console.log('parent id-->' +parentID);

        //store in database this information
        dbHelper.storeHighlightDetails(title, text, parentID, function(err, data){

            if(err){
                console.log('some error while storing highlight details');
            }else{
                console.log('result from database-->' +JSON.stringify(data));
                if(data && data.insertId!=-1){
                    res.json({'status': 'success'});
                }else{
                    res.json({'status': 'failure'});
                }
            }
        })
    });

    app.get('/getHighlights', function(req, res){

        var title = req.query.title;
        console.log('getting highlights for-->' +title);

        dbHelper.getHighlights(title, function(err, data){

            if(err){
                console.log('some error while storing highlight details')
            }else{
                console.log('result from database-->' +JSON.stringify(data));
                res.json(data);
            }
        });
    });
}