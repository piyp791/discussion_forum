function populateProfile(profileInfo){

	console.log(JSON.stringify(profileInfo));
	profileInfo = profileInfo[0];
	for (var key in profileInfo) {
			if (profileInfo.hasOwnProperty(key)) {
			console.log(key + " -> " + profileInfo[key]);
			if(key!=='DisplayName'){
				$('#' +key).text(key + '--->'+ profileInfo[key])	
			}else{
				$('#' +key).text(profileInfo[key])
			}
			
			}
	}
}

function createActivityText(postType, ParentID, bodytext){

 	var text = "";
 	if(postType == '1'){
 		text="User Posted a question "
 	}else{
 		text="User Added a post "
 	}
 	text+=" " + bodytext.substring(0, 500) + "..."
 	return text;

}

function formatProfileActivity(homePageContent, div){

	homePageContent = eval(homePageContent);
	console.log('home page content->' +JSON.stringify(homePageContent));
	console.log('home page content length->' +homePageContent.length);


	var pagebody = document.getElementById(div);

	var tbl = document.createElement("table");
  	var tblBody = document.createElement("tbody");
  	tbl.appendChild(tblBody);
  	pagebody.appendChild(tbl);

  	var row = document.createElement("tr");

  	var indexEl = document.createElement('th');
  	indexEl.innerHTML = 'S No.';
  	row.appendChild(indexEl);

  	var dateEl = document.createElement('th');
  	dateEl.innerHTML = 'Date';
  	row.appendChild(dateEl);

  	var activityEl = document.createElement('th');
  	activityEl.innerHTML = 'Activity';
  	row.appendChild(activityEl);

  	tblBody.appendChild(row)

	for(var i=0;i<homePageContent.length;i++){

		var row = document.createElement("tr");

		var id = homePageContent[i].Id;

		var par = document.createElement('p');
		//row.appendChild(par);

		//console.log('home page content ->' +JSON.stringify(homePageContent[i]));

		var postid = homePageContent[i].ID;
		console.log('post id-->', postid);

		var date = homePageContent[i].CreationDate;
		console.log('date-->', date)

		var postType = homePageContent[i].PostTypeId;
		console.log('postType-->', postType)

		var ParentID = -1;

		if(postType=='2'){
			ParentID = homePageContent[i].ParentID;
			console.log('ParentID-->', ParentID)
		}

		var body = homePageContent[i].Body;
		console.log('body-->', body);
		
      	var cell = document.createElement("td");
		var cellText = document.createTextNode(i+1);
      	cell.appendChild(cellText);
      	row.appendChild(cell);

      	var cell = document.createElement("td");
		var cellText = document.createTextNode(date.substring(0, date.indexOf('T')));
      	cell.appendChild(cellText);
      	row.appendChild(cell);

      	//par.innerHTML = createActivityText(postType, ParentID, body);

		var cell = document.createElement("td");
		var cellText = document.createTextNode(createActivityText(postType, ParentID, body));
      	//cell.appendChild(par);
      	cell.appendChild(cellText)
      	cell.style.width = '85%'
      	row.appendChild(cell);

      	tblBody.appendChild(row)
	}
	//document.getElementById('trendingcontent').innerHTML = homePageContent
}

$(document).ready(function(){
    $('input[name="tab-group"]').change(function(){
        if($('#tab-3').prop('checked')){
            //alert('tab 3 is checked!');


            //get user details from localstorage
            var loggedInUser = localStorage.getItem("userid");
            $.get( "/activity/" +loggedInUser, function( data ) {
            	console.log(JSON.stringify(data));

            	$('#activity').text("")
            	formatProfileActivity(data, 'activity')
            	//$('#activity').text(JSON.stringify(data))

            });
        }
    });
});