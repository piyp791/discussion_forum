from collections import defaultdict

from surprise import SVD
from surprise import NMF
from surprise import Dataset
from surprise.dataset import Reader
import redis
import pickle
import json

def get_top_n(predictions, n=10):
    '''Return the top-N recommendation for each user from a set of predictions.

    Args:
        predictions(list of Prediction objects): The list of predictions, as
            returned by the test method of an algorithm.
        n(int): The number of recommendation to output for each user. Default
            is 10.

    Returns:
    A dict where keys are user (raw) ids and values are lists of tuples:
        [(raw item id, rating estimation), ...] of size n.
    '''

    # First map the predictions to each user.
    top_n = defaultdict(list)
    for uid, iid, true_r, est, _ in predictions:
        top_n[uid].append((iid, est))

    # Then sort the predictions for each user and retrieve the k highest ones.
    for uid, user_ratings in top_n.items():
        user_ratings.sort(key=lambda x: x[1], reverse=True)
        top_n[uid] = user_ratings[:n]

    return top_n


# First train an SVD algorithm on the movielens dataset.
# path to dataset file
file_path = 'ratings_robotics.dat'

# As we're loading a custom dataset, we need to define a reader. In the
# movielens-100k dataset, each line has the following format:
# 'user item rating timestamp', separated by '\t' characters.
reader = Reader(line_format='user item rating', rating_scale=(1, 5), sep=' ')

data = Dataset.load_from_file(file_path, reader=reader)
#data.split(n_folds=5)  # data can now be used normally
#data = Dataset.load_builtin('ml-1m')
trainset = data.build_full_trainset()
#algo = NMF()
algo = SVD()
algo.train(trainset)

# Than predict ratings for all pairs (u, i) that are NOT in the training set.
testset = trainset.build_anti_testset()
predictions = algo.test(testset)

top_n = get_top_n(predictions, n=10)

r = redis.Redis('localhost')
p_mydict = pickle.dumps(top_n)
r.hset('test', 'suggestions_dict',json.dumps(top_n))

#print(len(top_n))
print(top_n)
#print top_n['1']
# Print the recommended items for each user
#for uid, user_ratings in top_n.items():
#    print(uid, [iid for (iid, _) in user_ratings])

#read_dict = r.hget('test', 'suggestions_dict')
#yourdict = pickle.loads(read_dict)
#read_dict = json.loads(read_dict)
#print(len(read_dict))

#taglist = r.hget('test', 'taglist')
#taglist = json.loads(taglist)
#print (taglist)
