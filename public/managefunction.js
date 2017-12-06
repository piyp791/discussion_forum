/*name: textaudit.js*/
/*description: javascript code for all posts files handling login, report issue and clearing of popver on anywhere click*/
/*author: ppapreja*/



window.user;
window.blockcomment = false;
window.commentid = '';

/*handles login functionality*/
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

				$.get( "/getUserPreferences/" +accid , function( data ) {
            		//console.log(JSON.stringify(data));
            		var tags = data.tags;
            		console.log('tags-->' +tags)
            		tags = JSON.parse(tags);
            		//console.log(tags['tags'])

            		var tagsObj = tags['tags'];
            		console.log('tag obj-->' +JSON.stringify(tagsObj));

            		window.tagarr = [];
            		tagarr.push(['Tags', 'Preference'])
            		for (tag in tagsObj){
            			var temp = [];
            			console.log('tag-->' +tag);
            			temp.push(tag);
            			temp.push(tagsObj[tag])
            			tagarr.push(temp)
            		}
            		console.log(tagarr)

            		$.get( "/getUserTags/" +accid , function( data ) {

            			console.log('real tags-->' +JSON.stringify(data.tags))

            			realtags = JSON.parse(data.tags);

            			tagarr = []
            			tagarr.push(['Tags', 'Preference'])
            			for(temptag in realtags){
            				tagarr.push([realtags[temptag], 1])
            			}

            			console.log('new tag arr-->'+JSON.stringify(tagarr));

            			google.charts.load('current', {'packages':['corechart']});
            			google.charts.setOnLoadCallback(drawChart);
            		});
            		
            		//$('#latest-content').html(JSON.stringify(data)
            	});

            	//window.tagarr = tagarr;

            	
				
			}else{
				//alert('Invalid username');
				$('#loginresult').html('It seems the username doesn\'t exist!!');
			}
	});
}

/*handles report issue functionality*/
function reportIssue(){

	var issueText = document.getElementById('issuetext').value; 
	console.log(issueText);
	$.post( "/reportIssue", { issue: issueText }, function( data ) {
		alert('Thanks for reporting the issue. ')
		$('#issueModal').modal('toggle');
	});

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