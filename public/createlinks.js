//separate div for each post (question and answer)!!!!
function getHomeLinks(homePageContent, div){

	homePageContent = eval(homePageContent);
	console.log('home page content->' +JSON.stringify(homePageContent));
	console.log('home page content length->' +homePageContent.length);


	var pagebody = document.getElementById(div);

	var tbl = document.createElement("table");
  	var tblBody = document.createElement("tbody");
  	tbl.appendChild(tblBody);
  	pagebody.appendChild(tbl);

  	var row = document.createElement("tr");
  	var dateEl = document.createElement('th');
  	dateEl.innerHTML = 'Date';
  	row.appendChild(dateEl);
  	var viewEl = document.createElement('th');
  	viewEl.innerHTML = 'Views';
  	row.appendChild(viewEl);
  	var linkEl = document.createElement('th');
  	linkEl.innerHTML = 'Question';
  	row.appendChild(linkEl);
  	tblBody.appendChild(row)

	for(var i=0;i<homePageContent.length;i++){

		var row = document.createElement("tr");

		var id = homePageContent[i].Id;

		var par = document.createElement('p');
		par.className = "post-home";
		par.Id = "post-"+ id;

		//row.appendChild(par);

		//console.log('home page content ->' +JSON.stringify(homePageContent[i]));

		var link = homePageContent[i].Title;
		console.log('link-->', link);
		link = link.replace("?", "%3F")

		var date = homePageContent[i].CreationDate;
		console.log('date-->', date)

		var views = homePageContent[i].ViewCount;
		console.log('views-->', views)

		var a = document.createElement('a');
		a.title = link;

		var linktext = link.includes("?")?link.replace("?", "%3F"):link;
		var linktext = link.includes("'")?link.replace("'", "%27"):link;
		console.log('linktext-->', linktext)

		a.href = '/page/' + linktext

		var cell = document.createElement("td");
		var cellText = document.createTextNode(date.substring(0, date.indexOf('T')));
      	cell.appendChild(cellText);
      	row.appendChild(cell);
		
      	var cell = document.createElement("td");
		var cellText = document.createTextNode(views);
      	cell.appendChild(cellText);
      	row.appendChild(cell);

   
		a.innerHTML = link;
		par.appendChild(a);

		var cell = document.createElement("td");
      	cell.appendChild(par);
      	cell.style.width = '80%'
      	row.appendChild(cell);

      	tblBody.appendChild(row)
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