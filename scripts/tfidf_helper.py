from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from scipy.sparse.csr import csr_matrix #need this if you want to save tfidf_matrix

tf = TfidfVectorizer(analyzer='word', ngram_range=(1,3),min_df = 0, stop_words = 'english', sublinear_tf=True)

def do_tf_idf(post_content_array, post_id_array):

	tfidf_matrix = tf.fit_transform(post_content_array);
	feature_names = tf.get_feature_names();

	tfidf_obj = {};
	for doc_index in range(len(post_content_array)):

		keyword_score_mapping_arr = [];
		#print '\n\nfinding important keywords for the document-->', post_content_array[doc_index]
		feature_index = tfidf_matrix[doc_index,:].nonzero()[1];
		#print feature_index

		tfidf_scores = zip(feature_index, [tfidf_matrix[doc_index, x] for x in feature_index]);

		for w, s in [(feature_names[i], s) for (i, s) in tfidf_scores]:
	  		#print w, s
	  		keyword_score_mapping_arr.append({'n-gram': w, 'score': s});
	  	tfidf_obj[post_id_array[doc_index]] = keyword_score_mapping_arr;
	#print tfidf_obj
	return tfidf_obj;