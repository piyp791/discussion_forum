window.user;

window.blockcomment = false;
window.commentid = '';

function doLogin(){
	console.log("do login called")
	var accid = $('#accid').val();
	var password = $('#lpasswd').val();
	console.log('acc id ->' +accid + ' password -->' +password);
	$.post( "/login", { userid: accid }, function( data ) {
			console.log('data-->' +JSON.stringify(data))
			if(data.isverified == true){
				//user logged in
				window.user = accid;
				//save user details in localstorage
				localStorage.setItem("userid", accid);

				$('#myModal').modal('toggle');

				//remove existing elements from nav bar
				removePreLoginLinks()
				//add new elements to nav bar
				createPostLogInLinks();
			}else{
				//alert('Invalid username');
				$('#loginresult').html('It seems the username doesn\'t exist!!');
			}
	});
}

function reportIssue(){

	var issueText = document.getElementById('issuetext').value; 
	console.log(issueText);
	$.post( "/reportIssue", { issue: issueText }, function( data ) {
		alert('Thanks for reporting the issue. ')
		$('#issueModal').modal('toggle');
	});

}

function similarity(s1, s2) {
      var longer = s1;
      var shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      var longerLength = longer.length;
      if (longerLength == 0) {
        return 1.0;
      }
      return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}


function checkSimilarity(textinput, blockedword){

  //apply porter stemmer algorithm
  console.log('check similarity-->' +textinput, blockedword)
  var similarityresult = similarity(textinput, blockedword);
  return similarityresult;
}


$(document).ready(function(){
    $('input[name="tab-group"]').change(function(){
        if($('#latest-tab').prop('checked')){
            //alert('latest tab is checked!');

            //clear tab first

            $.get( "/getlatest" , function( data ) {
            	//console.log(JSON.stringify(data));
            	$('#latest-content').html("")
            	getHomeLinks(data, 'latest-content')
            	//$('#latest-content').html(JSON.stringify(data))
            });
            
        }
    });
});

$(".comment-btn").popover({

    title: '<h3 class="custom-title"><span class="glyphicon glyphicon-info-sign"></span> You\'re almost there!</h3>',
    content : function(){
    	
    	var commentbtnid = this.id;
    	console.log('from inside popover for id -->' +commentbtnid);
    	//check for similarity
    	//extract text from text area
		var id = commentbtnid.substring(commentbtnid.lastIndexOf('-')+1);

		commentid = id;
		console.log('commentid-->' +commentid)
		var textareaid = 'speech-'+id;
		console.log('text area id-->' +textareaid);
		var text = $('#' + textareaid).val();
		console.log('text-->' +text);


		var blockedwords = ['thanks!!', 'thank you', '+1', 'me too!!', 'great!']
		for(var i=0;i<blockedwords.length;i++){

			stemtext = stemmer(text);
			stemmedblockedword = stemmer(blockedwords[i]);
			console.log(stemtext + '--' + stemmedblockedword)
			var similarityresult = checkSimilarity(stemtext, stemmedblockedword);
			console.log('similarity result to ' +  blockedwords[i] +' -->' +similarityresult)
			if(similarityresult>0.60){
				blockcomment = true;
				break;
			}
		}

  console.log('block comment -->' + blockcomment)


    	if(blockcomment == false){

    		return "<div id = contentcheck><p id = 'okaytext' style = 'font-color:green;'>OK</p></div> <div id = 'similaritydiv'><label><input  class = 'sample' id='similaritycheckbox' type='checkbox' /> Are you sure your comments isn't just a \"Me too!\", \"thanks\", or \"+1\"? </label></div><button type='button' id = 'postcmtbtn'  class='popovercomment btn btn-primary btn-block' onclick = \'publishcomment()\'>Post Question</button><div id = 'faqlink'><p>Here\'s some more info about posting questions.</p></div>"

    	}else{
    		return "<div id = contentcheck><p id = 'notokaytext' style = 'font-color:red;'>Fix Needed</p></div> <div id = 'similaritydiv'><label><input  class = 'sample' id='similaritycheckbox' type='checkbox' /> Are you sure your comments isn't just a \"Me too!\", \"thanks\", or \"+1\"? </label></div><button type='button' id = 'postcmtbtn'  class='popovercomment btn btn-primary btn-block' onclick = \'publishcomment()\'>Post Question</button><div id = 'faqlink'><p>Here\'s some more info about posting questions.</p></div>"
    	}	
    },
    html: true
}); 


function publishcomment(){
	console.log('comment id -->' +commentid);

	//ajax request to post comment
	var textareaid = 'speech-'+commentid;
  	console.log('text area id-->' +textareaid);
  	var text = $('#' + textareaid).val();
  	console.log('text-->' +text);
}

/***** Dismiss all popovers by clicking outside  **************/

$(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
            (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
        }

    });
});