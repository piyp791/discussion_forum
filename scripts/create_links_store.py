import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
from bs4 import BeautifulSoup as bshtml
import html
from random import randrange
import mysql.connector
from mysql.connector import errorcode
import sys
import re
from unidecode import unidecode

def remove_non_ascii(text):
    return unidecode(unicode(text, encoding = "utf-8"))

class NumpyMySQLConverter(mysql.connector.conversion.MySQLConverter):
    """ A mysql.connector Converter that handles Numpy types """

    def _float32_to_mysql(self, value):
        return float(value)

    def _float64_to_mysql(self, value):
        return float(value)

    def _int32_to_mysql(self, value):
        return int(value)

    def _int64_to_mysql(self, value):
		return int(value)

def getConn():
     try:
        cnx = mysql.connector.connect(user='root', password='piyush0791',
                                      host='127.0.0.1',
                                      database='forum_db')
        print cnx
        cnx.set_converter_class(NumpyMySQLConverter)
        
        print 'connected!!'
        return cnx
     except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Invalid user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)

        return None


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

def insertIntoDB(linkid, postid, votes, views, dislikes, html, href, likes, classstr, cnx):


	if len(href) > 700:
		return
		
	add_user = ("INSERT INTO Link_Store (LinkID, PostID, votes, views, dislikes, href, likes, class) VALUES (\"" + linkid + "\", \"" +postid + "\"," + str(votes) + "," +str(views) + "," +str(dislikes) + ",\"" + href  + "\"," + str(likes)  + ",\"" + classstr + "\")");

	
	print 'query -->', add_user
	cursor = cnx.cursor()
	try:
	    cursor.execute(add_user)
	    cnx.commit()
	    cursor.close()
	    print "Lastrowid: ", cursor.lastrowid
	    print ("Data inserted successfully")
	    return cursor.lastrowid
	    #sys.exit();
	except Exception as e:

	    print ("Data insertion failed!!!");
	    print(e)
	    #sys.exit();


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

	#print linkobjs

	cnx = getConn()
	for tempobj in linkobjs:
		link_arr = linkobjs[tempobj];
		for link in link_arr:
			print link
			insertIntoDB(link['id'], tempobj, link['votes'], link['views'], link['dislikes'], link['html'], link['href'], link['likes'], link['class'], cnx)

	#save_obj_in_redis('linkobjs', linkobjs)
	print 'links information saved'

if __name__ == "__main__":
	main();