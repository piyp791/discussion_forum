from surprise import Dataset
from surprise import SVD
from surprise import accuracy
from surprise.dataset import Reader
from surprise import evaluate, print_perf
from surprise import NMF

file_path = 'ratings.dat'
reader = Reader(line_format='user item rating', sep=' ')
data = Dataset.load_from_file(file_path, reader=reader)
#data = Dataset.load_builtin('ml-100k')

#algo = SVD()
algo = NMF()

trainset = data.build_full_trainset()
algo.train(trainset)

testset = trainset.build_testset()
predictions = algo.test(testset)
# RMSE should be low as we are biased
accuracy.rmse(predictions, verbose=True)  # ~ 0.68 (which is low)
perf = evaluate(algo, data, measures=['RMSE', 'MAE'])
print_perf(perf)