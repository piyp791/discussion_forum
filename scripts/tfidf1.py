document_0 = "China has a strong economy that is growing at a rapid pace. However politically it differs greatly from the US Economy."
document_1 = "At last, China seems serious about confronting an endemic problem: domestic violence and corruption."
document_2 = "Japan's prime minister, Shinzo Abe, is working towards healing the economic turmoil in his own country for his view on the future of his people."
document_3 = "Vladimir Putin is working hard to fix the economy in Russia as the Ruble has tumbled."
document_4 = "What's the future of Abenomics? We asked Shinzo Abe for his views"
document_5 = "Obama has eased sanctions on Cuba while accelerating those against the Russian Economy, even as the Ruble's value falls almost daily."
document_6 = "Vladimir Putin is riding a horse while hunting deer. Vladimir Putin always seems so serious about things - even riding horses. Is he crazy?"

X = [document_0, document_1, document_2, document_3, document_4, document_5, document_6]



def get_vec_pipe(num_comp=0, reducer='svd'):
''' Create text vectorization pipeline with optional dimensionality reduction. '''

    tfv = TfidfVectorizer(
        min_df=6, max_features=None, strip_accents='unicode',
        analyzer="word", token_pattern=r'\w{1,}', ngram_range=(1, 2),
        use_idf=1, smooth_idf=1, sublinear_tf=1)

    # Vectorizer
    vec_pipe = [
        ('col_extr', JsonFields(0, ['title', 'body', 'url'])),
        ('squash', Squash()),
        ('vec', tfv)
    ]

    # Reduce dimensions of tfidf
    if num_comp > 0:
        if reducer == 'svd':
            vec_pipe.append(('dim_red', TruncatedSVD(num_comp)))
        elif reducer == 'kbest':
            vec_pipe.append(('dim_red', SelectKBest(chi2, k=num_comp)))
        elif reducer == 'percentile':
            vec_pipe.append(('dim_red', SelectPercentile(f_classif, percentile=num_comp)))

        vec_pipe.append(('norm', Normalizer()))

    return Pipeline(vec_pipe)



Xtr = vec_pipe.fit_transform(X)
vec = vec_pipe.named_steps['vec']
features = vec.get_feature_names()

def top_tfidf_feats(row, features, top_n=25):
    ''' Get top n tfidf values in row and return them with their corresponding feature names.'''
    topn_ids = np.argsort(row)[::-1][:top_n]
    top_feats = [(features[i], row[i]) for i in topn_ids]
    df = pd.DataFrame(top_feats)
    df.columns = ['feature', 'tfidf']
    return df


def top_feats_in_doc(Xtr, features, row_id, top_n=25):
	''' Top tfidf features in specific document (matrix row) '''
	row = np.squeeze(Xtr[row_id].toarray())
	return top_tfidf_feats(row, features, top_n)