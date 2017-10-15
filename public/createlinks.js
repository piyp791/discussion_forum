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


//separate div for each post (question and answer)!!!!
function getHomeLinks(homePageContent){

	homePageContent = eval(homePageContent);
	//console.log('home page content ->' +JSON.stringify(homePageContent));

	var pagebody = document.getElementById('content-1');
	for(var i=0;i<homePageContent.length;i++){

		var id = homePageContent[i].Id;

		var par = document.createElement('p');
		par.className = "post-home";
		par.Id = "post-"+ id;

		pagebody.appendChild(par);

		console.log('home page content ->' +JSON.stringify(homePageContent[i]));

		var link = homePageContent[i].Title;
		console.log('link-->', link)
		//link = link.replace("?", "%3F")

		var date = homePageContent[i].CreationDate;
		console.log('date-->', date)	

		var a = document.createElement('a');
		a.title = link;

		var linktext = link.includes("?")?link.replace("?", "%3F"):link;
		var linktext = link.includes("'")?link.replace("'", "%27"):link;
		console.log('linktext-->', linktext)

		a.href = '/page/' + linktext
		a.innerHTML = link;
		//a.className = "post"

		par.appendChild(a);

		console.log(pagebody)
	}
	//document.getElementById('trendingcontent').innerHTML = homePageContent
}

function openModal(action){
	console.log('action -->' +action);
	if(action == 'login'){
		$('#modaltitle').text('Log In'); 

		$('#tabContent a[href="#log-in"]').tab('show')
	}else if(action == 'signup'){
		$('#modaltitle').text('Sign Up');  

		$('#tabContent a[href="#sign-up"]').tab('show')
	}
	$("#myModal").modal();
}


function removePreLoginLinks(){
	$("#loginlink").remove();
	$("#signuplink").remove();
}

function removePostLoginLinks(){
	$("#profilelink").remove();
	$("#preferenceslink").remove();
	$("#signoutlink").remove();
}


function createPostLogInLinks(){

	var navbar = document.getElementById('myTopnav');

	var signoutlink = document.createElement('a');
		signoutlink.innerHTML = 'Sign Out';
		signoutlink.style.float = "right"
		signoutlink.id = 'signoutlink'
		signoutlink.onclick = function(){
			
			//clear localstorage
			localStorage.setItem("userid", "")
			localStorage.removeItem("userid");

			removePostLoginLinks();
			createPreLoginLinks();

		}
		
		navbar.appendChild(signoutlink);

		var preferencesLink = document.createElement('a');
		preferencesLink.innerHTML = 'Preferences';
		preferencesLink.id = 'preferenceslink';
		preferencesLink.style.float = "right"

		navbar.appendChild(preferencesLink);

		var profilelink = document.createElement('a');
		profilelink.innerHTML = 'Profile';
		profilelink.id = 'profilelink';
		profilelink.style.float = "right"
		profilelink.href = "/users/id/" + window.user
		
		navbar.appendChild(profilelink);

}

function createPreLoginLinks(){

	var navbar = document.getElementById('myTopnav');
	var loginlink = document.createElement('a');
	loginlink.innerHTML = 'Log In';
	loginlink.title = "Log In";
	loginlink.id = "loginlink";
	loginlink.href = "#";
	loginlink.style.float = "right"
	loginlink.onclick = function () {
		openModal('login');
	};
	
	navbar.appendChild(loginlink);

	var signuplink = document.createElement('a');
	signuplink.id = "signuplink";
	signuplink.href = "#";
	signuplink.innerHTML = 'Sign Up';
	signuplink.style.float = "right"
	signuplink.onclick = function () {
		openModal('signup');
	};

	navbar.appendChild(signuplink);

}

function checkLoggedInUser(){

	var navbar = document.getElementById('myTopnav');
	
	//if (!window.user){
	if(!localStorage.getItem("userid") || localStorage.getItem("userid")==""){

		console.log('no user seems to be logged in....');
		//hide profile/preferences page
		createPreLoginLinks();
		
		
	}else{

		createPostLogInLinks()
		
	}

	var aboutlink = document.createElement('a');
	aboutlink.innerHTML = 'About';
	aboutlink.style.float = "right"
	navbar.appendChild(aboutlink);
}