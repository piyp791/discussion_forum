var fs = require('fs');
var parser = require('xml2json');

/*this is supposed to be a worker thread code*/

//get data from database
//QUESTION: store the data in redis in the format : ????how
//QUESTION: do i store the user data as well for content based filtering???  

/*

postdata: [{tagname: tag1, details: {
				users: {1:{questions:[], answers:[]}, -1:{}, 10:{}, .....}, questions: [{post1:{}, post2:{}}], answers: [post1:{}, post2:{}]
				}}, 
			{tagname: tag2, details: {
				users: {}, questions: [], answers: []
				}}, 
			{tagname: tag3, details: {
				users : {}, questions:[], answers:[]
				}}, 
			{tagname: tag4, details:{}}.....]

useractivity : [[1,2,3,...], [3,5,2....], [1,4,2....]]
userlist: [0,1,3,5,7,13.....]
taglist:['tag', 'discussion', 'meta', ....]

*/


//how do we store data in postdata format ?
//entire_data = select * from posts

//iterate over posts
//	for each post in posts:
//		if posttypeid == 1:
//			tag = get_tag(post)
//			if tag doesnt exist in postdata:
//				create new tag
//			add question to questions array of tag
//		else if posttypeid == 2:
//			parentid = get parentid
//			tag = gettag(parent_post)
//			if tag doesnt exist in postdata:
//				create new tag
//			add answer to answers array of tag



//		postdata created!!!

//how do we create userdata matrix?

//users = select * from users order by <some condition>
//postdata =  get from redis
//	for each user in users:
//		for each tag in postdata:
//			if tag.users has user
//				actvitycount = number(questions) + number(answers)
//

//userlist -> users data fetched from db
//taglist -> postdata array keys


//matrix factorization:
//get useractivity matrix from redis
//pass to likey
//model.recommendations