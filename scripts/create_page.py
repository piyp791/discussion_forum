import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re

folder = "views/";

def findAnswers(root, quesId):
	answerStr = '';
	for child in root:
		postTypeId = child.get('PostTypeId');
		if postTypeId != '1':
			#its an answer
			#see if its parent id matches the quesId
			parentId = child.get('ParentId')
			if parentId == quesId:
				answer = child.get('Body')
				answer = re.sub(r'[^\x00-\x7F]+',' ', answer)
				answerStr  = answerStr + answer + "\n\n"

	return answerStr
		

def main():

	tree = ET.parse('../data/apple.meta.stackexchange.com/Posts.xml')
	root = tree.getroot()
	for child in root:

		postTypeId = child.get('PostTypeId');
		if(postTypeId == '1'):
			#create separate page
			title = child.get('Title');
			title = re.sub(r'[^\x00-\x7F]+',' ', title)
			body = child.get('Body');
			body = re.sub(r'[^\x00-\x7F]+',' ', body)
			title = title.replace("/", "~")
			quesId = child.get('Id');

			f = open(folder + title + ".ejs","w") #opens file with name of "test.txt"
			
			#find answers
			answerStr = findAnswers(root, quesId)
			content = "<html>\n\t<head>\n\t\t<title id = 'pagetitle'>"  +title+ "\n\t\t</title>\n\t<head>\n\t<body id = 'pagebody'>" +body+"\n\n<h1>ANSWERS</h1>\n\t\t" +answerStr+ "\t</body>\n</html>";

			f.write(content);
			f.close();

if __name__ == "__main__":
	main();
