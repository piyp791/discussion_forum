import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
import es as indexer

def find_parent_info(root, parentid):
	for child in root:
		post_id = child.get('Id');
		if post_id == parentid:
			title = child.get('Title');
			return title;

def find_post_for_comment(root, post_id):
	for child in root:
		postid = child.get('Id');
		posttypeid = child.get('PostTypeId');
		if post_id == postid and posttypeid == '1':
			title = child.get('Title');
			return title;

		elif post_id == postid and posttypeid == '2':
			parentid = child.get('ParentId');
			title = find_parent_info(root, parentid);
			return title;

		elif posttypeid == '2' and post_id == child.get('ParentId'):

			parentid = child.get('ParentId');
			title = find_parent_info(root, parentid);
			return title;

def index_comments(comment_root, root, fts):
	for child in comment_root:
		post_id = child.get('PostId');
		comment_id = child.get('Id')
		
		title = find_post_for_comment(root, post_id);
		title = re.sub(r'[^\x00-\x7F]+',' ', title);
		title = title.replace("/", "~");
		
		body = child.get('Text');
		body = re.sub(r'[^\x00-\x7F]+',' ', body);

		body = title +  ' ' + body

		fts.add_document(comment_id, title, 'text', body);


def index_posts(root, fts):

	for child in root:
		post_type_id = child.get('PostTypeId');
		post_id = child.get('Id');

		if post_type_id == '2':
			parent_id = child.get('ParentId');
			parent_title = find_parent_info(root, parent_id)
			
			#post_id = parent_id
			title = parent_title
			
		elif post_type_id == '1':
			
			title = child.get('Title');

		if title is not None:
			title = re.sub(r'[^\x00-\x7F]+',' ', title);
			title = title.replace("/", "~");
		
		#print title;
		body = child.get('Body');
		body = re.sub(r'[^\x00-\x7F]+',' ', body);
		#print body

		body = title +  ' ' + body
		fts.add_document(post_id, title, 'text', body);

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

	print 'indexing comments...';
	index_comments(comment_root, root, fts);
	print 'comments indexed...';


if __name__ == "__main__":
	main();