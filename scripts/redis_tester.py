import redis
import json


def main():

	r = redis.Redis('localhost')

	#test the saved structure by retriving it
	tfidf_obj = r.hget('test', 'tfidf_obj');
	tfidf_obj = json.loads(tfidf_obj)
	print len(tfidf_obj)
	print tfidf_obj['2376']


if __name__ == "__main__":
	main();