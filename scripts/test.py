import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
from random import randrange
from random import *
from misc import get_parent_tags
from misc import split_tags_str
from redis_helper import load_obj_from_redis
from redis_helper import save_obj_in_redis
from tfidf_helper import do_tf_idf

def store_words_for_each_doc(post_tree, comment_tree):

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
	tfidf_obj = do_tf_idf(post_content_array, post_id_array)
	return tfidf_obj

def update_tag_store(tag_post_store, tag_arr, post_id, post_type_id):
    #print 'inside update tag store function:: post_type_id-->', post_type_id;

    for tag in tag_arr:
        if tag not in tag_post_store:
            tag_post_store[tag] = {};
            tag_post_store[tag]['questions'] = [];
            tag_post_store[tag]['answers'] = [];
            tag_post_store[tag]['comments'] = [];

        #add post
        if post_type_id == '1':
            tag_post_store[tag]['questions'].append(post_id);
        elif post_type_id == '2':
            tag_post_store[tag]['answers'].append(post_id);
        else:
            tag_post_store[tag]['comments'].append(post_id);

    return tag_post_store;

def create_post_store(post_tree, comment_tree):

	post_store = {};
	user_tag_store = {};
	tag_post_store = {};
	post_root = post_tree.getroot();
	for post_child in post_root:

		post_obj = {};
		post_id = post_child.get('Id');
		post_type_id = post_child.get('PostTypeId');
		post_user_id = post_child.get('OwnerUserId');

		if post_type_id == '1':

			tags = post_child.get('Tags');
			tags_arr = split_tags_str(tags);
			tag_post_store = update_tag_store(tag_post_store, tags_arr, post_id, post_type_id);

			if post_id not in post_store:
				#create new entry for this post

				post_obj['Id'] = post_id;
				post_obj['Title'] = post_child.get('Title');
				post_obj['answers'] = [];
				post_obj['comments'] = [];
				post_obj['Tags'] = tags_arr;

				post_store[post_id] = post_obj;

		elif post_type_id == '2':

			parent_id = post_child.get('ParentId');

			tags = get_parent_tags(parent_id, post_tree);
			tags_arr = split_tags_str(tags);
			tag_post_store = update_tag_store(tag_post_store, tags_arr, post_id, post_type_id);

			if parent_id not in post_store:

				#create new entry for parent id
				temp_root = post_tree.getroot();
				for temp_child in temp_root:
					temp_type_id = temp.child.get('PostTypeId');
					temp_id = temp_child.get('Id');
					if temp_type_id == '1' and temp_id == parent_id:
						post_obj['Id'] = temp_id
						post_obj['Title'] = temp_child.get('Title')
						post_obj['answers'] = [];
						post_obj['comments'] = [];
						post_obj['Tags'] = tags_arr;

						post_obj['answers'].append(post_id)

						post_store[temp_id] = post_obj;

			elif parent_id in post_store:
				post_store[parent_id]['answers'].append(post_id);

		tags_arr = split_tags_str(tags);
		print 'user tag array-->', user_tag_store;
		print 'tags array -->', tags_arr;
		print 'post user id -->', post_user_id;
        if post_user_id not in user_tag_store:
        	print 'creating new entry for users';
        	user_tag_store[post_user_id] = tags_arr;
        else:
        	user_tag_store[post_user_id] = user_tag_store[post_user_id] + list(set(tags_arr) - set(user_tag_store[post_user_id]));


	print user_tag_store
	#print post_store
	comment_root =comment_tree.getroot();
	for comment_child in comment_root:
		comment_post_id = comment_child.get('PostId');
		comment_id = comment_child.get('Id');
		comment_user = comment_child.get('UserId')
		if comment_post_id in post_store:
			post_store[comment_post_id]['comments'].append(comment_id);

			tagstr = get_parent_tags(comment_post_id, post_tree);
			tags_arr = split_tags_str(tagstr);

			tag_post_store = update_tag_store(tag_post_store, tags_arr, comment_post_id, '3');
			if comment_user not in user_tag_store:
				user_tag_store[comment_user] = tags_arr
			else:
				user_tag_store[comment_user] = user_tag_store[comment_user] + list(set(tags_arr) - set(user_tag_store[comment_user]))

		elif comment_post_id not in post_store:
			for question in post_store:
				answers = post_store[question]['answers'];
				if comment_post_id in answers:
					post_store[question]['comments'].append(comment_id);

					tagstr = get_parent_tags(question, post_tree);
					tags_arr = split_tags_str(tagstr);
					tag_post_store = update_tag_store(tag_post_store, tags_arr, comment_post_id, '3');

					if comment_user not in user_tag_store:
						user_tag_store[comment_user] = tags_arr
					else:
						user_tag_store[comment_user] = user_tag_store[comment_user] + list(set(tags_arr) - set(user_tag_store[comment_user]))
					break;

	#print user_tag_store
	return (post_store, user_tag_store, tag_post_store)

def main():

	post_tree = ET.parse('../data/robotics.stackexchange.com/Posts.xml');
	comment_tree = ET.parse('../data/robotics.stackexchange.com/Comments.xml');
	user_tree = ET.parse('../data/robotics.stackexchange.com/Users.xml');
	tag_tree = ET.parse('../data/robotics.stackexchange.com/Tags.xml');

	#create structure for post relationships
	print 'Creating post, user tag, and tag post stores stores';
	(post_store, user_tag_store, tag_post_store) = create_post_store(post_tree, comment_tree);
	#print tag_post_store
	#save post store and user-tag store to redis
	print 'Saving post and user tag, and post tag stores';
	save_obj_in_redis('post_store', post_store);
	save_obj_in_redis('user_tag_store', user_tag_store);
	save_obj_in_redis('tag_post_store', tag_post_store);

	print 'Onto doing the tfidf and storing the important keywords for each doc';
	tfidf_obj = store_words_for_each_doc(post_tree, comment_tree);

	print 'saving the tfidf table in redis';
	save_obj_in_redis('tfidf_obj', tfidf_obj);


if __name__ == "__main__":
	main();