import redis
import json
from redis_helper import load_obj_from_redis
from operator import itemgetter
from redis_helper import save_obj_in_redis

def main():

	'''tfidf_obj = load_obj_from_redis('tfidf_obj');
	user_activity_obj = load_obj_from_redis('user_activity_obj');
	user_keywords_store = {};

	for userid in user_activity_obj:
		if userid is not None:
			posts = user_activity_obj[userid];
			#print posts
			for post in posts:
				if post is not None and post in tfidf_obj:
					#print 'post present'
					keywords = tfidf_obj[post];
					#print keywords

					if userid not in user_keywords_store:
						#print 'creating new entry'
						user_keywords_store[userid] = keywords[:60]
					elif userid in user_keywords_store:
						if user_keywords_store[userid] is None:
							user_keywords_store[userid] = keywords[:60]
						else:
							user_keywords_store[userid] = user_keywords_store[userid].append(keywords[:60]);


	count = 0;
	for user in user_keywords_store:
		mylist = user_keywords_store[user];
		print mylist
		print count
		if mylist is not None:
			newlist = sorted(mylist, key=itemgetter('score'), reverse=True)
			newlist = newlist[:10]
			user_keywords_store[user] = newlist
			count = count+1


	save_obj_in_redis('user_keywords_store', user_keywords_store )
	for user in user_keywords_store:
		print user
		print user_keywords_store[user];'''

	load_obj_from_redis()
		


if __name__ == "__main__":
	main();