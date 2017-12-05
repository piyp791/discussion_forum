import numpy as np;
import redis
import json
import sys
from scipy import stats
import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re

userdict = {}

QUES_RATING = 1
ANSWER_RATING = 2
COMMENT_RATING = 1.5
ACCESS_RATING = 0.2

user_counter_dict = {}
post_counter_dict = {}
user_counter = 0;
post_counter = 0;

def write_to_file(userdict):
	ratings_str = ''
	for user in userdict:
		#if user == '41011':
		#	print 'user-->' +user
		for post in userdict[user]:
			
		#print user + ' -->' +  str(userdict[user])
		#for post in userdict[user]:
		#	print user + ' ->' + post
			activity = userdict[user][post]
			if activity > 5:
				activity = 5;
			if ratings_str == '':
				ratings_str = str(user) + " " + str(post) + " " + str(activity)
			else:
				ratings_str = ratings_str + ("\n" + str(user) + " " + str(post) + " " + str(activity))

	f = open("ratings_robotics.dat","w") #opens file with name of "test.txt"
	f.write(ratings_str);
	f.close();
	print ratings_str


def save_counters_to_json(user_counter_dict, post_counter_dict, r):
	print user_counter_dict
	print post_counter_dict
	r.hset('test', 'user_counter_dict',json.dumps(user_counter_dict))
	r.hset('test', 'post_counter_dict',json.dumps(post_counter_dict))


def convert_counters(type, id):

	global user_counter;
	global post_counter;
	if type == 'user':
		if id in user_counter_dict:
			return user_counter_dict[id];
		else:
			user_counter = user_counter+1;
			user_counter_dict[id] = user_counter;
			return user_counter_dict[id];

	elif type == 'post':
		if id in post_counter_dict:
			return post_counter_dict[id];
		else:
			post_counter = post_counter+1;
			post_counter_dict[id] = post_counter;
			return post_counter_dict[id];		

def add_post_to_user_activity_dict(userId, postId, postTypeId):
	#print 'adding post to user activity';
	userId = convert_counters('user', userId)
	postId = convert_counters('post', postId)
	
	
	if userId in userdict:
		if postId in userdict[userId]:
			#print 'dictionary exists'
			if postTypeId == '1':
				userdict[userId][postId]+=QUES_RATING
			elif postTypeId == '2':
				userdict[userId][postId]+=ANSWER_RATING
			elif postTypeId == '3':
				userdict[userId][postId]+=COMMENT_RATING
		else:
			#post doesnt exist for this user
			
			if postTypeId == '1':
				userdict[userId][postId] = QUES_RATING
			elif postTypeId == '2':
				userdict[userId][postId] = ANSWER_RATING
			elif postTypeId == '3':
				userdict[userId][postId] = COMMENT_RATING

	else:
		#create new dictionary for user
		userdict[userId] = {}
		if postTypeId == '1':
			userdict[userId][postId] = QUES_RATING
		elif postTypeId == '2':
			userdict[userId][postId] = ANSWER_RATING
		elif postTypeId == '3':
			userdict[userId][postId] = COMMENT_RATING


def get_user_activity_from_comments():

	print 'getting user data from comments...';
	comment_tree = ET.parse('../data/robotics.stackexchange.com/Comments.xml');
	comment_root = comment_tree.getroot();

	for child in comment_root:
		postId = child.get('PostId');
		userId = child.get('UserId'); 
		if postId is not None and userId is not None:
			add_post_to_user_activity_dict(userId, postId, '3');	  

def get_user_activity_from_posts():

	print 'getting user data from posts...';
	tree = ET.parse('../data/robotics.stackexchange.com/Posts.xml');
	root = tree.getroot();
	for child in root:
		postTypeId = child.get('PostTypeId');
		postId = child.get('Id');
		userId = child.get('OwnerUserId')

		if postTypeId is not None and postId is not None and userId is not None:
			#print postId, ' -->', postTypeId
			if postTypeId == '1':

				#add post to user activity dictionary
				#if userId is None:
					#print 'called from posts with None userId'
				add_post_to_user_activity_dict(userId, postId, postTypeId);
			elif postTypeId == '2':

				#find parentpost
				parentId = child.get('ParentId')
				#add post to user activity dictionary
				add_post_to_user_activity_dict(userId, parentId, postTypeId);


def main():
	#iterate over Posts data and get user rating json
	get_user_activity_from_posts();
	#print userdict['3'];
	#iterate over Comments data and add to user rating json
	get_user_activity_from_comments();
	print userdict;
	#write the ratings json to a file
	r = redis.Redis('localhost');
	user_activity_obj = r.hget('test', 'user_activity_obj');
	user_activity_obj = json.loads(user_activity_obj);
	#get user activity from browsing activity
	#get_user_browsing_activity(user_activity_obj);
	write_to_file(userdict);
	#save ratings json to redis
	#save_counters_to_json(user_counter_dict, post_counter_dict, r)
	
if __name__ == "__main__":
	main();