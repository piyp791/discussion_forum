import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
import es as indexer
import redis
import json
from misc import split_tags_str

def find_parent_info(root, parentid):
	for child in root:
		post_id = child.get('Id');
		if post_id == parentid:
			title = child.get('Title');
			tags_str = child.get('Tags');
			tags_arr = split_tags_str(tags_str);
			return title, tags_arr;

def find_post_for_comment(root, post_id):
	for child in root:
		postid = child.get('Id');
		posttypeid = child.get('PostTypeId');
		if post_id == postid and posttypeid == '1':
			title = child.get('Title');
			tags_str = child.get('Tags');
			tags = split_tags_str(tags_str);
			return title, tags;

		elif post_id == postid and posttypeid == '2':
			parentid = child.get('ParentId');
			title, tags = find_parent_info(root, parentid);
			return title, tags;

		elif posttypeid == '2' and post_id == child.get('ParentId'):
			parentid = child.get('ParentId');
			title, tags = find_parent_info(root, parentid);
			return title, tags;

def index_comments(comment_root, root, fts, post_store):
	for child in comment_root:
		post_id = child.get('PostId');
		comment_id = child.get('Id')
		
		title, tags = find_post_for_comment(root, post_id);
		title = re.sub(r'[^\x00-\x7F]+',' ', title);
		title = title.replace("/", "~");
		
		body = child.get('Text');
		body = re.sub(r'[^\x00-\x7F]+',' ', body);

		body = title +  ' ' + body

		if post_id in post_store:
			parentid = post_id
		else:
			for post in post_store:
				answers = post_store[post]['answers']
				if post_id in answers:
					parentid = post_id
					break;
		fts.add_document(comment_id, title, tags, parentid, 'comment', body);


def index_posts(root, fts):

	for child in root:
		post_type_id = child.get('PostTypeId');
		post_id = child.get('Id');

		parent_id = ''
		if post_type_id == '2':
			parent_id = child.get('ParentId');
			parent_title, parent_tags = find_parent_info(root, parent_id);
			
			#post_id = parent_id
			title = parent_title;
			tags = parent_tags;
			
		elif post_type_id == '1':
			
			title = child.get('Title');
			tags_str = child.get('Tags');
			tags = split_tags_str(tags_str);

		if title is not None:
			title = re.sub(r'[^\x00-\x7F]+',' ', title);
			title = title.replace("/", "~");
		
		#print title;
		body = child.get('Body');
		body = re.sub(r'[^\x00-\x7F]+',' ', body);
		#print body

		body = title +  ' ' + body
		if post_type_id == '1':
			fts.add_document(post_id, title, tags, parent_id, 'question', body);
		else:
			fts.add_document(post_id, title, tags, parent_id, 'answer', body);

def main():

	tree = ET.parse('../data/robotics.stackexchange.com/Posts.xml');
	root = tree.getroot();

	comment_tree = ET.parse('../data/robotics.stackexchange.com/Comments.xml');
	comment_root = comment_tree.getroot();

	index_name = 'df';
	fts = indexer.SearchEngine(index_name);

	print 'indexing posts...';
	index_posts(root, fts);
	print 'posts indexed...';

	r = redis.Redis('localhost')
	post_store = r.hget('test', 'post_store');
	post_store = json.loads(post_store)

	print 'indexing comments...';
	index_comments(comment_root, root, fts, post_store);
	print 'comments indexed...';


if __name__ == "__main__":
	main();