window.user;

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