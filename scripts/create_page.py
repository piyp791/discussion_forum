import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re

folder = "../views/";


def createAnswerHTML(answer):
	htmlContent = "\n\t\t\t<div id = \"post-ans\" class = \"post\">" +\
	"\n\t\t\t\t" +answer+ \
	"\n\t\t\t</div><br>";
	return htmlContent


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
				answerStr  = answerStr + createAnswerHTML(answer)

	return answerStr
		

def createContent(title, body, answerStr):

	content = "<html>"+ \
			  "\n\t<head>" + \
			  "\n\t\t<link rel=\"stylesheet\" href=\"/style.css\"/>" + \
			  "\n\t\t<title id = 'pagetitle'>"+title+ \
			  "\n\t\t</title>"+\
			  "\n\t<head>"+\
			  "\n\t<body id = 'pagebody'>"+ \
			  "\n\t\t<div class = \"container\">" +\
			  "\n\t\t\t<header>" +\
			  "\n\t\t\t\t<h1>Just Another Discussion Forum</h1>" +\
			  "\n\t\t\t</header>" +\
			  "\n\t\t\t<div class=\"topnav\" id=\"myTopnav\">" + \
			  "\n\t\t\t\t<a href=\"/home\">Home</a>" + \
			  "\n\t\t\t\t<a href=\"#\" style = \"float:right;\">About</a>" +\
			  "\n\t\t\t\t<a href=\"#\" style = \"float:right;\">Preferences</a>" +\
			  "\n\t\t\t\t<a href=\"#\" style = \"float:right;\">Profile Link</a>" +\
			  "\n\t\t\t</div>" +\
			  "\n\t\t\t<div id = \"post-ques\" class = \"post\">" +\
			  "\n\t\t\t\t<h2>" + title + "</h2>" +\
			  "\n"	+body+ \
			  "\n\t\t\t</div>" +\
			  "\n\n<h1>ANSWERS</h1>" +\
			  answerStr +\
			  "\n\t\t\t<footer>Moore & Peps collaboration.</footer>"+\
			  "\n\t</div>" +\
			  "\n\t</body>" + \
			  "\n</html>";

	return content


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
			content = createContent(title, body, answerStr)

			f.write(content);
			f.close();

if __name__ == "__main__":
	main();
