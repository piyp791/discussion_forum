import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
from bs4 import BeautifulSoup as bshtml
import html
from redis_helper import save_obj_in_redis
from random import randrange

def get_likes_dislikes_views(post_views, post_score):
	#depends on question views, likes, dislikes
	#modified_view_count = 2*post_score + post_views
	print 'post views->', post_views
	if post_views>30:
		link_views = randrange(int(post_views)/2,int(post_views));
		#print 'link views-->', link_views
		link_likes = randrange(0, int(link_views)/2);
		#print 'link likes-->', link_likes
		link_dislikes = randrange(0, int(link_views)/3);
	else:
		link_views = randrange(1,3);
		link_likes = randrange(0,2);
		link_dislikes = randrange(0,1);
	return (link_views, link_likes, link_dislikes)



def main():
	print 'hello';
	post_tree = ET.parse('../data/robotics.stackexchange.com/Posts.xml');
	post_root = post_tree.getroot();

	linkobjs = {}
	for post_child in post_root:
		linkarr = []
		body = post_child.get('Body');
		score = post_child.get('Score');
		post_id = post_child.get('Id');
		post_type_id = post_child.get('PostTypeId');
		if post_type_id == '1':
			views = post_child.get('ViewCount');
			parent_id = post_id
			link_id = 'link-ques-' +post_id;

		elif post_type_id == '2':
			parent_id = post_child.get('ParentId');
			link_id = 'link-ans-' + post_id;

		bs = bshtml(body);
		atags = bs.findAll("a");
		for tag in atags:
			linkobj = {}

			views, likes, dislikes = get_likes_dislikes_views(views, score);
			linkobj['class'] = 'pagelinks'; 
			linkobj['href'] = tag['href'];
			linkobj['html'] = tag.decode_contents(formatter="html");
			linkobj['votes'] = score;
			linkobj['views'] = views;
			linkobj['likes'] = likes;
			linkobj['dislikes'] = dislikes;
			linkobj['id'] = link_id;
			if parent_id not in linkobjs:
				linkobjs[parent_id] = []
				linkobjs[parent_id].append(linkobj)
			else:
				linkobjs[parent_id].append(linkobj)

	print linkobjs
	save_obj_in_redis('linkobjs', linkobjs)
	print 'links information saved'

if __name__ == "__main__":
	main();