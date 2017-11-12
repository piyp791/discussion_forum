import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re
import es as indexer

def main():

	tree = ET.parse('../data/apple.meta.stackexchange.com/Posts.xml');
	root = tree.getroot();

	index_name = 'df'
	fts = indexer.SearchEngine(index_name)

	for child in root:

		title = child.get('Title');
		if title is not None:
			title = re.sub(r'[^\x00-\x7F]+',' ', title);
			title = title.replace("/", "~");
		print title
		body = child.get('Body');
		body = re.sub(r'[^\x00-\x7F]+',' ', body);
		print body

		fts.add_document(title, 'text', body);

if __name__ == "__main__":
	main();
