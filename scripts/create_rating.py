import matplotlib.pyplot as plt; 
plt.rcdefaults();
import numpy as np;
import matplotlib.pyplot as plt;
import redis
import pickle
import json
import sys
from scipy import stats
import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re

userdict = {}

QUES_RATING = 1
ANSWER_RATING = 1
COMMENT_RATING = 1

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
				ratings_str = user + " " + post + " " + str(activity)
			else:
				ratings_str = ratings_str + ("\n" + user + " " + post + " " + str(activity))

	f = open("ratings.dat","w") #opens file with name of "test.txt"
	f.write(ratings_str);
	f.close();
	print ratings_str



def add_post_to_user_activity_dict(userId, postId, postTypeId):
	#print 'adding post to user activity';

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
	comment_tree = ET.parse('../data/apple.meta.stackexchange.com/Comments.xml');
	comment_root = comment_tree.getroot();

	for child in comment_root:
		postId = child.get('PostId');
		userId = child.get('UserId'); 
		if postId is not None and userId is not None:
			add_post_to_user_activity_dict(userId, postId, '3');	  

def get_user_activity_from_posts():

	print 'getting user data from posts...';
	tree = ET.parse('../data/apple.meta.stackexchange.com/Posts.xml');
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
	print userdict['3'];
	#iterate over Comments data and add to user rating json
	get_user_activity_from_comments();
	print userdict;
	#write the ratings json to a file
	write_to_file(userdict);
	#save ratings json to redis
	
if __name__ == "__main__":
	main();