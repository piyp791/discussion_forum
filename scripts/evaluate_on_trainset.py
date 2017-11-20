"""
This module descibes how to test the performances of an algorithm on the
trainset.
"""

from __future__ import (absolute_import, division, print_function,
                        unicode_literals)

from surprise import Dataset
from surprise import SVD
from surprise import NMF
from surprise import SVDpp
from surprise import accuracy
from surprise.dataset import Reader

file_path = 'ratings_robotics.dat'
reader = Reader(line_format='user item rating', rating_scale=(1, 5), sep=' ')
data = Dataset.load_from_file(file_path, reader=reader)
#data = Dataset.load_builtin('ml-100k')

algo = SVD()
#algo = NMF()
#algo = SVDpp()

trainset = data.build_full_trainset()
algo.train(trainset)

testset = trainset.build_testset()
predictions = algo.test(testset)
# RMSE should be low as we are biased
accuracy.rmse(predictions, verbose=True)  # ~ 0.68 (which is low)

# We can also do this during a cross-validation procedure!
print('CV procedure:')

data.split(3)
for i, (trainset_cv, testset_cv) in enumerate(data.folds()):
    print('fold number', i + 1)
    algo.train(trainset_cv)

    print('On testset,', end='  ')
    predictions = algo.test(testset_cv)
    accuracy.rmse(predictions, verbose=True)

    print('On trainset,', end=' ')
    predictions = algo.test(trainset_cv.build_testset())
    accuracy.rmse(predictions, verbose=True)
