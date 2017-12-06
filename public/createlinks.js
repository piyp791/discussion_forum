/*name: createlinks.js*/
/*description: javascript code for all posts files handling creation of navbar links in relation to user login, and other login functionalities*/
/*author: ppapreja*/

/*opens login modal on login/signup link click*/
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


/*removes login and sign up links once the user has logged in*/
function removePreLoginLinks(){
	$("#loginlink").remove();
	$("#signuplink").remove();
}

/*removes profile, preferences and signout links once the user has logged out*/
function removePostLoginLinks(){
	$("#profilelink").remove();
	$("#preferenceslink").remove();
	$("#signoutlink").remove();
}

/*creates profile, preferences and signout links once the user has logged in*/
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

			//remove user model from home page
			document.getElementById("piechart").innerHTML = "";
			window.tagarr = null;

		}
		
		navbar.appendChild(signoutlink);

		var preferencesLink = document.createElement('a');
		preferencesLink.innerHTML = 'Preferences';
		preferencesLink.id = 'preferenceslink';
		preferencesLink.style.float = "right";
    	if(!localStorage.getItem("userid") || localStorage.getItem("userid")==""){
            preferencesLink.href = "#";
        }else{
            preferencesLink.href = "getPreferences/" +localStorage.getItem(("userid"));
		}

		navbar.appendChild(preferencesLink);

		var profilelink = document.createElement('a');
		profilelink.innerHTML = 'Profile';
		profilelink.id = 'profilelink';
		profilelink.style.float = "right"

		//get logged in user id
		if(!localStorage.getItem("userid") || localStorage.getItem("userid")==""){
			profilelink.href = "/users/id/#";
		}else{
			profilelink.href = "/users/id/" + localStorage.getItem("userid")
		}
		
		navbar.appendChild(profilelink);

}

/*creates login and signup links once the user has logged in*/
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

/*checks if the user is loggedin. creates pre/post login links accordingly*/
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