from elasticsearch import Elasticsearch
from datetime import datetime
import sys

class SearchEngine():
	def __init__(self, index_name):
		self.es = Elasticsearch()
		self.index_name = index_name

	def add_document(self, title, doctype, body):
		self.es.index(index=self.index_name, doc_type=doctype, body={"title": title, "content": body, "timestamp": datetime.now()})
		print('added document ', title)

	def search(self, query):
		#res = es.search(index="asgn3", body={"query": {"match_all": {}}})
		res = self.es.search(index=self.index_name, body={"query": {"match": {"content": query}}})
		return res;

	def deleteIndex(self):
		self.es.indices.delete(index=self.index_name, ignore=[400, 404])

def main():

	query = sys.argv[1]
	index_name = 'df'
	fts = SearchEngine(index_name);
	results = fts.search(query)
	print len(results['hits']['hits'])

	#fts.deleteIndex()

if __name__ == "__main__":
	main()
