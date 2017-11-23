import redis
import json
from redis_helper import load_obj_from_redis

def main():

	'''r = redis.Redis('localhost')

	#test the saved structure by retriving it
	tfidf_obj = r.hget('test', 'tfidf_obj');
	tfidf_obj = json.loads(tfidf_obj);
	print len(tfidf_obj);
	print tfidf_obj['2376'];'''

	user_tag_store = load_obj_from_redis('user_tag_store');
	#print user_tag_store;
	print user_tag_store['21'];
	#post_store = load_obj_from_redis('post_store');
	#print post_store['1'];
	tfidf_obj = load_obj_from_redis('tfidf_obj');
	print tfidf_obj['3027']


if __name__ == "__main__":
	main();