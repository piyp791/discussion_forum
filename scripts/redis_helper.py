import redis
import json

redis_obj = redis.Redis('localhost')

def load_obj_from_redis(obj_name_str, key_name = 'test'):
    loaded_obj = redis_obj.hget(key_name, obj_name_str);
    loaded_obj = json.loads(loaded_obj);
    return loaded_obj;

def save_obj_in_redis(obj_name_str, obj, key_name = 'test'):
    obj = json.dumps(obj)
    redis_obj.hset(key_name, obj_name_str, obj);

def main():

	r = redis.Redis('localhost');

	#test the saved structure by retriving it
	tfidf_obj = r.hget('test', 'tfidf_obj');
	tfidf_obj = json.loads(tfidf_obj);
	print len(tfidf_obj);
	print tfidf_obj['2376'];


if __name__ == "__main__":
	main();