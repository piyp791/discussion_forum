import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
from random import randrange
from random import *
import redis
import json
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from scipy.sparse.csr import csr_matrix #need this if you want to save tfidf_matrix


def init_tfidf():
	tf = TfidfVectorizer(analyzer='word', ngram_range=(1,3),
                     min_df = 0, stop_words = 'english', sublinear_tf=True)
	return tf

def do_tf_idf(post_content_array, post_id_array, tf):
	
	tfidf_matrix =  tf.fit_transform(post_content_array)
	feature_names = tf.get_feature_names()

	tfidf_obj = {}
	for doc_index in range(len(post_content_array)):

		keyword_score_mapping_arr = []
		#print '\n\nfinding important keywords for the document-->', post_content_array[doc_index]
		feature_index = tfidf_matrix[doc_index,:].nonzero()[1]
		#print feature_index

		tfidf_scores = zip(feature_index, [tfidf_matrix[doc_index, x] for x in feature_index])

		for w, s in [(feature_names[i], s) for (i, s) in tfidf_scores]:
	  		#print w, s
	  		keyword_score_mapping_arr.append({'n-gram': w, 'score': s})
	  	tfidf_obj[post_id_array[doc_index]] = keyword_score_mapping_arr
	#print tfidf_obj
	return tfidf_obj



def store_words_for_each_doc(post_tree, comment_tree, tf):

	#create array from Posts tree
	post_root = post_tree.getroot();
	post_content_array = [];
	post_id_array = [];
	for child in post_root:

		post_id = child.get('Id');
		post_content = ''
		post_type_id = child.get('PostTypeId');
		if post_type_id == 1:
			title = child.get('Title');
			post_content = post_content + title;
		post_body = child.get('Body');
		post_content = post_content + post_body
		
		post_content_array.append(post_content)
		post_id_array.append(post_id)
	
	#print post_content_array
	tfidf_obj = do_tf_idf(post_content_array, post_id_array, tf)
	return tfidf_obj



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


def create_tag_wise_posts(post_tree, comment_tree):
	tag_post_obj = {};
	root = post_tree.getroot();
	for child in root:
		post_id = child.get('Id');
		post_type_id = child.get('PostTypeId');
		#print post_id, ' type -->', post_type_id
		if post_type_id == '1':

			post_title = child.get('Title');
			post_title = re.sub(r'[^\x00-\x7F]+',' ', post_title);

			tags = child.get('Tags');

		elif post_type_id == '2':
			parent_id = child.get('ParentId');
			tags = get_parent_tags(parent_id, post_tree);

		tags_arr = split_tags_str(tags);
		
		#create entry for post for each tag
		for tag in tags_arr:
			if tag not in tag_post_obj:

				#create new entry for the tag and then post
				tag_post_obj[tag] = {}
				tag_post_obj[tag]['questions'] = []
				tag_post_obj[tag]['answers'] = []
				tag_post_obj[tag]['comments'] = []

			obj = {}
			obj['id'] = post_id
			if post_type_id == '1':
				obj['Title'] = post_title
				obj['Tags'] = tags_arr
				tag_post_obj[tag]['questions'].append(obj)
			elif post_type_id == '2':
				tag_post_obj[tag]['answers'].append(obj)

		#print tag_post_obj

	'''comment_root = comment_tree.getroot();

	for comment_child in comment_root:
		post_id = comment_child.get('PostId')

		for child in root:
			p_post_id = child.get('Id')
			p_post_type_id = child.get('PostTypeId')
			if p_post_id == post_id:
				if p_post_type_id == '1':
					tags = child.get('Tags')
					break;
				elif p_post_type_id == '2':
					tags = get_parent_tags(child.get('ParentId'), post_tree)
					break;

		tag_arr = split_tags_str(tags)
		for tag in tags_arr:
			if tag not in tag_post_obj:

				#create new entry for the tag and then post
				tag_post_obj[tag] = {}
				tag_post_obj[tag]['questions'] = []
				tag_post_obj[tag]['answers'] = []
				tag_post_obj[tag]['comments'] = []

			tag_post_obj[tag]['comments'].append(post_id)'''

	#print tag_post_obj
	return tag_post_obj


def main():

	post_tree = ET.parse('../data/robotics.stackexchange.com/Posts.xml');
	comment_tree = ET.parse('../data/robotics.stackexchange.com/Comments.xml');
	user_tree = ET.parse('../data/robotics.stackexchange.com/Users.xml');
	tag_tree = ET.parse('../data/robotics.stackexchange.com/Tags.xml');

	r = redis.Redis('localhost')

	#create structure to hold posts segregated ta wise
	print 'Creating tag wise posts data structure'
	tag_post_obj = create_tag_wise_posts(post_tree, comment_tree);
	#print tag_post_obj

	#save the structure in redis db
	print 'saving the structure in redis'
	r.hset('test', 'tag-post_obj',json.dumps(tag_post_obj))
		
	#test the saved structure by retriving it
	#new_tag_post_obj = r.hget('test', 'tag-post_obj');
	#new_tag_post_obj = json.loads(new_tag_post_obj)
	#print new_tag_post_obj
	print 'initializing tf-idf'
	tf = init_tfidf()

	print 'Onto doing the tfidf and storing the important keywords for each doc'
	tfidf_obj = store_words_for_each_doc(post_tree, comment_tree, tf);
	#for obj in tfidf_obj:
	#	print obj, '->', tfidf_obj[obj]
	print 'saving the tfidf table in redis'
	r.hset('test', 'tfidf_obj',json.dumps(tfidf_obj))


if __name__ == "__main__":
	main();