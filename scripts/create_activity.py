import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
from random import randrange
from random import *
import redis
import json


def split_tags_str(tag_str):
	tag_str =  tag_str[1:-1];
	tag_arr = tag_str.split('><')
	return tag_arr

def get_parent_tags(parent_id, post_tree):
	root = post_tree.getroot();
	for child in root:
		post_id = child.get('Id');
		if parent_id == post_id:
			tags = child.get('Tags')
			return tags

def get_activity_count_from_user_info(child):
	upvotes = child.get('UpVotes');
	downvotes = child.get('DownVotes');
	reputation = child.get('Reputation');
	bio = child.get('AboutMe');
	#to be done later
	return 20

def get_tags_array_from_tree(tag_tree):
	tags = []
	root = tag_tree.getroot();
	for child in root:
		tag = child.get('TagName');
		if tag not in tags:
			tags.append(tag);
	return tags


def get_random_tags(tag_array):
	#choose 3 random tags
	chosen_tags = []
	while True:
		random_index = randrange(0,len(tag_array))
		if tag_array[random_index] not in chosen_tags:
			chosen_tags.append(tag_array[random_index]);
			if len(chosen_tags) ==3:
				break;
	return chosen_tags

def get_post_for_tag(tag, tag_post_obj):

	tag_questions = tag_post_obj[tag]['questions']
	random_index = randrange(0,len(tag_questions))
	return tag_post_obj[tag]['questions'][random_index]
	

def get_activity_for_user(activity_count, tags, userId, tag_post_obj, post_store):
	act_obj = []
	print 'userid -->', userId
	print 'tags-->', tags
	for i in range(activity_count):
		random_number = random()
		if random_number>=0 and random_number <0.5:
			#pick tag 1
			#print 'tag 1'
			
			post = get_post_for_tag(tags[0], tag_post_obj);
		elif random_number>=0.5 and random_number<0.75:
			#pick tag 2
			#print 'tag 2'
			
			if len(tags) > 1:
				post = get_post_for_tag(tags[1], tag_post_obj);
			else:
				post = get_post_for_tag(tags[0], tag_post_obj);
		elif random_number>=0.75 and random_number<1:
			#pick tag 3
			#print 'tag 3';
			if len(tags) > 2:
				post = get_post_for_tag(tags[2], tag_post_obj);
			elif len(tags) >1:
				post = get_post_for_tag(tags[1], tag_post_obj);
			else:
				post = get_post_for_tag(tags[0], tag_post_obj);
		print post;
		act_obj.append(post);
		#get answers and comments for this post and append that to user activity as well
		postid = post['id']
		#print 'post id-->', postid
		postanswers = post_store[postid]['answers']
		postcomments = post_store[postid]['comments']
		#print 'postanswers-->', postanswers
		for postanswer in postanswers:
			temp = {}
			temp['id'] = postanswer
			act_obj.append(temp)

		for postcomment in postcomments:
			temp = {}
			temp['id'] = postcomment
			act_obj.append(temp)
		
		#act_obj.append(postanswers)
		#act_obj.append(postcomments)
	#print act_obj
	return act_obj;


def get_tags_for_user(userId, user_tag_store):
	tags = user_tag_store[userId];
	return tags

def create_browsing_pattern_for_not_active_users(no_activity_users, user_tree, tag_array, tag_post_obj, post_store):
	non_active_users_activity_obj = {}
	for userId in no_activity_users:
		#get upvotes, downvotes, reputation and about me section
		#userId = child.get('Id');
		activity_count = randrange(10,20)
		tags = get_random_tags(tag_array)
		#print tags
		act_obj = get_activity_for_user(activity_count, tags, userId, tag_post_obj, post_store);
		non_active_users_activity_obj[userId] = act_obj;

	return non_active_users_activity_obj;

def create_browsing_pattern_for_active_users(final_user_list, user_tree, tags_arr, tag_post_obj, user_activity_obj, user_tag_store, post_store):
	for userId in final_user_list:

		if userId is not None:
			activity_count = randrange(30,40)
			tags = get_tags_for_user(userId, user_tag_store)

			act_obj = get_activity_for_user(activity_count, tags, userId, tag_post_obj, post_store);

			if userId in user_activity_obj:
				user_activity_obj[userId] = user_activity_obj[userId] + list(set(act_obj) - set(user_activity_obj[userId]))	
			else:
				user_activity_obj[userId] = act_obj

	return user_activity_obj;

def find_user_list_from_posts(post_tree):
	users = []
	root = post_tree.getroot();
	for child in root:
		userid = child.get('OwnerUserId');
		if userid not in users:
			users.append(userid);
	return users

def find_user_list_from_comments(comment_tree):
	users = []
	root = comment_tree.getroot();
	for child in root:
		userid = child.get('UserId');
		if userid not in users:
			users.append(userid);
	return users

def get_all_users(user_tree):
	users = []
	root = user_tree.getroot();
	for child in root:
		userid = child.get('Id');
		if userid not in users:
			users.append(userid);
	return users

def main():

	'''post_tree = ET.parse('../data/robotics.stackexchange.com/Posts.xml');
	comment_tree = ET.parse('../data/robotics.stackexchange.com/Comments.xml');
	user_tree = ET.parse('../data/robotics.stackexchange.com/Users.xml');
	tag_tree = ET.parse('../data/robotics.stackexchange.com/Tags.xml');

	all_users = get_all_users(user_tree);

	post_users = find_user_list_from_posts(post_tree);
	comment_users = find_user_list_from_comments(comment_tree);

	final_user_list = post_users + list(set(comment_users) - set(post_users));

	print len(all_users);
	print len(post_users);
	print len(comment_users);
	print len(final_user_list);

	no_activity_users = list(set(all_users) - set(final_user_list));
	print len(no_activity_users);

	#retrieve the saved tag-post structure
	r = redis.Redis('localhost')

	tag_post_obj = r.hget('test', 'tag-post_obj');
	tag_post_obj = json.loads(tag_post_obj)

	#retrieve the saved user-tag structure
	user_tag_store = r.hget('test', 'user_tag_store');
	user_tag_store = json.loads(user_tag_store);

	#retrieve the saved post structure
	post_store = r.hget('test', 'post_store');
	post_store = json.loads(post_store);
	
	tags_arr = get_tags_array_from_tree(tag_tree);
	user_activity_obj = create_browsing_pattern_for_not_active_users(no_activity_users, user_tree, tags_arr, tag_post_obj, post_store);
	print len(user_activity_obj)
	user_activity_obj = create_browsing_pattern_for_active_users(final_user_list, user_tree, tags_arr, tag_post_obj, user_activity_obj, user_tag_store, post_store);
	print len(user_activity_obj)
	print 'length of the user activity table -->', len(user_activity_obj)
	for user in user_activity_obj:
	    if user == '10':
	        print user_activity_obj[user]
	        break;
	#update user-tag-table

	
	#print 'saving simulated activity data structure to redis'
	r.hset('test', 'user_activity_obj',json.dumps(user_activity_obj))
	#print user_activity_obj[randrange(1, len(user_activity_obj))'''

	r = redis.Redis('localhost');
	#create user-keyword mapping
	print 'hello'

	user_activity_obj = r.hget('test', 'user_activity_obj');
	user_activity_obj = json.loads(user_activity_obj);
	print 'user activity object loaded...';

	user_tag_store = r.hget('test', 'user_tag_store');
	#print user_tag_store
	user_tag_store = json.loads(user_tag_store);
	print 'user tag store loaded...';

	tfidf_obj = r.hget('test', 'tfidf_obj');
	tfidf_obj = json.loads(tfidf_obj)
	print 'tfidf object loaded'

	user_keywords_store = {};

	for userid in user_activity_obj:

		if userid is not None:

		    #print user_activity_obj[userid];
		    posts = user_activity_obj[userid];
		    #print posts
		    for post in posts:
		        #find keywords for this post
		        id = post['id'];
		        if id is not None and id in tfidf_obj:
		            keywords = tfidf_obj[id];
		            if userid in user_keywords_store:

		            	if user_keywords_store[userid] is None:
		            		user_keywords_store[userid] = keywords[:20];
		            	else:
		            		#print 'keywords -->', keywords
		                	user_keywords_store[userid] = user_keywords_store[userid].append(keywords[:20]);
		                	#print 'user keystore-->', user_keywords_store[userid]
	                else:
	                    user_keywords_store[userid] = keywords[:20];
	                    #print 'user store -->', user_keywords_store[userid]


	#print 'user keyword store-->', str(user_keywords_store)
	#for user in user_keywords_store:
	#	print user
	#	print user_keywords_store[user]
	print len(user_keywords_store);
	r.hset('test', 'user_keywords_store',json.dumps(user_keywords_store));
	print 'user keywords store saved...';


if __name__ == "__main__":
	main();