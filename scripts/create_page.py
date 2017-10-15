import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
import re

folder = "../views/";


def createAnswerHTML(id, answer, score):

	if score is None:
		score = '--'
	htmlContent = "\n\t\t\t<br><div id = \"ans-" + id + "\"  class = \"post\">" +\
	"\n\t\t\t\t<h2>Answer</h2>" +\
	"\n\t\t\t\t<h3>Score ::" + score +  "</h3>" +\
	"\n\t\t\t\t<p>" +answer+ "</p><br>" +\
	"\n\t\t\t</div>";
	return htmlContent

def createCommentHTML(id, comment):
	htmlContent = "\n\t\t\t<div id = \"comment-" +id + "\" class = \"comment\">" +\
	"\n\t\t\t\t<p>" +comment+ "</p>" +\
	"\n\t\t\t</div>";
	return htmlContent

def findComments(root, quesId):
	#print root
	#print quesId
	commentHeader = '<h3>Comments</h3>';
	commentStr = '';
	
	#div for containing comments
	parentdivStart = "\n\t\t\t<div id = \"commentsection-" +quesId + "\" class = 'collapse'>"
	for child in root:
		postId = child.get('PostId');
		if postId == quesId:
			id = child.get("Id");
			comment = child.get('Text');
			comment = re.sub(r'[^\x00-\x7F]+',' ', comment);
			commentStr  = commentStr + createCommentHTML(id, comment);

	parentdivEnd = "\n\t\t\t</div>";

	entercontent = "\n\t\t\t\t<textarea id = \"speech-"+quesId+"\" rows=\"3\" cols=\"80\"></textarea><br>" +\
	"\n\t\t\t\t<button class=\"record-start\" id=\"start-"+quesId+"\">"+\
	"\n\t\t\t\t\t<img id=\"start_img-" +quesId+"\" src=\"/mic.gif\" alt=\"Start\">" +\
	"\n\t\t\t\t</button>" +\
    "\n\t\t\t\t<button>Comment</button>";
	if commentStr !="":
		#print 'some comments'
		loadCmtsButton = "\n\t\t\t\t<button data-toggle = 'collapse' data-target = \"#commentsection-" + quesId +"\">Load Comments</button></br>";
		commentStr = commentHeader + loadCmtsButton + parentdivStart + commentStr + parentdivEnd + entercontent; 
	else:
		#print 'no comments'
		#display label
		noCommentsLabel = '<p>no comments yet<p><br>'
		commentStr = commentHeader + noCommentsLabel + parentdivStart + commentStr + parentdivEnd + entercontent; 

	return commentStr


def findAnswers(root, commentRoot, quesId):
	answerStr = '';
	for child in root:
		postTypeId = child.get('PostTypeId');
		if postTypeId != '1':
			#its an answer
			#see if its parent id matches the quesId
			parentId = child.get('ParentId')
			postId = child.get('Id');
			#print 'post id-->', postId
			if parentId == quesId:
				answer = child.get('Body')
				views = child.get('ViewCount')
				#print 'views-->', views
				score = child.get('Score')
				#print 'score-->', score
				answer = re.sub(r'[^\x00-\x7F]+',' ', answer)

				#find comment for this answer
				commentStr = findComments(commentRoot, postId);
				answerStr = answerStr + createAnswerHTML(postId, answer, score) + commentStr;

	return answerStr


def createContent(title, id, body, score, views, comments, answerStr):

	content = "<html>"+ \
			  "\n\t<head>" + \
			  "\n\t\t<link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\">" +\
			  "\n\t\t<script src=\"https://code.jquery.com/jquery-3.2.1.min.js\" integrity=\"sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=\"  crossorigin=\"anonymous\"></script>" +\
			  "\n\t\t<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script>" +\
			  "\n\t\t<link rel=\"stylesheet\" href=\"/style.css\"/>" + \
			  "\n\t\t<script src=\"/commons.js\"></script>" + \
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
			  "\n\t\t\t<div class = \"content\">" +\
			  "\n\t\t\t<div id = \"ques-" + id + "\" class = \"post\">" +\
			  "\n\t\t\t<h2>Question</h2>" +\
			  "\n\t\t\t<h3>Score ::" + score +"</h3>" +\
			  "\n\t\t\t<h3>Views ::" +views + "</h3>" +\
			  "\n\t\t\t\t<h2>" + title + "</h2>" +\
			  "\n"	+body+ \
			  "\n\t\t\t</div>" +\
			  comments + \
			  "\n\n<h1>Answers</h1>" +\
			  answerStr +\
			  "\n\t\t\t</div>" +\
			  "\n\t\t\t<div id = \"resourcestab\" class = \"resourcestab\">" +\
			  "\n\t\t\t\t<h2>RESOURCES</h2>" +\
			  "\n\t\t\t</div>" +\
			  "\n\t\t\t<footer>Moore & Peps collaboration.</footer>"+\
			  "\n\t</div>" +\
			  "\n\t<script type=\"text/javascript\">" +\
			  "\n\t\tvar content = $('.content').html();" +\
			  "\n\t\tpopulateResources(content)" +\
			  "\n\t</script>" +\
			  "\n\t<script src=\"/media.js\"></script>" +\
			  "\n\t</body>" + \
			  "\n</html>";

	return content


def main():

	tree = ET.parse('../data/apple.meta.stackexchange.com/Posts.xml');
	commentTree = ET.parse('../data/apple.meta.stackexchange.com/Comments.xml');
	commentRoot = commentTree.getroot();
	root = tree.getroot();
	for child in root:

		postTypeId = child.get('PostTypeId');
		if(postTypeId == '1'):
			#create separate page
			title = child.get('Title');
			title = re.sub(r'[^\x00-\x7F]+',' ', title);
			body = child.get('Body');
			body = re.sub(r'[^\x00-\x7F]+',' ', body);
			title = title.replace("/", "~");
			quesId = child.get('Id');
			score = child.get('Score');
			views = child.get('ViewCount')

			f = open(folder + title + ".ejs","w") #opens file with name of "test.txt"
			
			#findcomments
			commentStr = findComments(commentRoot, quesId)

			#find answers
			answerStr = findAnswers(root, commentRoot, quesId)
			
			content = createContent(title, quesId, body, score, views, commentStr, answerStr)

			f.write(content);
			f.close();

if __name__ == "__main__":
	main();