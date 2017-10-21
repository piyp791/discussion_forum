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
 	//text+=" " + bodytext.substring(0, 500) + "..."
 	text+=bodytext
 	return text;

}

function extractTagsFromStr(tagStr){

	console.log('original tags-->'+ tagStr);


	if(tagStr==null || tagStr.length==0 || !tagStr){
		return ['None'];
	}
	tagsArr = []
	tagsArr = tagStr.split('>')
	for(var i=0;i<tagsArr.length;i++){
		tagsArr[i] = tagsArr[i].replace('<', '')
	}
	tagsArr.splice(-1,1);
	console.log('formatted tags array-->'+ tagsArr)
	return tagsArr;

}

function mergeTagArrays(currentArray, origArray){
	var mergedArray = origArray.concat(currentArray.filter(function (item) {
    	return origArray.indexOf(item) < 0;
	}));
	return mergedArray;
}


function formatProfileActivity(homePageContent, div){

	homePageContent = eval(homePageContent);
	console.log('home page content->' +JSON.stringify(homePageContent));
	console.log('home page content length->' +homePageContent.length);

	var userTagArr = [];


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
		//console.log('post id-->', postid);

		var date = homePageContent[i].CreationDate;
		//console.log('date-->', date)

		var postType = homePageContent[i].PostTypeId;
		//console.log('postType-->', postType)

		var ParentID = -1;

		if(postType=='2'){
			ParentID = homePageContent[i].ParentID;
			console.log('ParentID-->', ParentID)
		}

		var body = homePageContent[i].Body;
		//console.log('body-->', body);

		var title = homePageContent[i].Title;
		title = title.replace("?", "%3F");
		console.log('title-->', title);

		var tags = homePageContent[i].Tags;
		console.log('tags-->'+tags);
		var tagsArr = extractTagsFromStr(tags);
		console.log('tags array-->'+tagsArr);

		//merge this array with usertag array
		userTagArr = mergeTagArrays(tagsArr, userTagArr);
		console.log('merged aray -->' +userTagArr)
		
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

		var cellText = document.createElement('p');
		cellText.innerHTML = 'Posted a question'
		var postLink = document.createElement('a');
		//postLink.innerHTML = createActivityText(1, 1 ,title);
		//postLink.href = '/page/'+ cellText.innerHTML;

		var linktext = title.includes("?")?title.replace("?", "%3F"):title;
        var linktext = title.includes("'")?title.replace("'", "%27"):title;

        postLink.href = '/page/' + linktext;
        postLink.innerHTML = linktext;

      	//cell.appendChild(par);
      	cellText.appendChild(postLink)
      	cell.appendChild(cellText)
      	cell.style.width = '85%'
      	row.appendChild(cell);

      	tblBody.appendChild(row)
	}
	//document.getElementById('trendingcontent').innerHTML = homePageContent

	var outerlistelement = document.getElementById('tagFilter')
	//populate dropdown with usertag array values
	for(var j=0;j<userTagArr.length;j++){
		
		var listelement = document.createElement('option');		
		listelement.innerHTML = userTagArr[j];
		outerlistelement.appendChild(listelement);
	}
}

$(document).ready(function(){

	console.log('code run....');

    $('input[name="tab-group"]').change(function(){
        if($('#tab-3').prop('checked')){
            //alert('tab 3 is checked!');

            //get user details from localstorage
            var loggedInUser = localStorage.getItem("userid");
            $.get( "/activity/" +loggedInUser, function( data ) {
            	console.log(JSON.stringify(data));

            	$('#activity').text("")
            	formatProfileActivity(data, 'activity');
            	//$('#activity').text(JSON.stringify(data))
            });
        }
    });


    $(".drop").change(function () {
        console.log('function called..');
        var selectedVal = this.value;
		//var firstDropVal = $('#drop').val();
		console.log('selected dropdown value -->' +selectedVal);
		//console.log('firstDropval-->'+firstDropVal);

    });


	$('#filtersearchbtn').click(function(){

		var sortval = $('#postTypeFilter').val();
		var tagval = $('#tagFilter').val();
		var posttypeval = $('#sortFilter').val();

		console.log('sort value -->' +sortval);
		console.log('tag value -->' +tagval);
		console.log('tag value -->' +posttypeval);

		if(sortval.includes('Select')){

			if(tagval.includes('Select')){

				

			}else{
				//query by tag only

			}
			
		}else{
			//query by post sort only 
		}

		//get user from localstorage
		var userid = localStorage.getItem('userid');
		$.get( "/activity/" +userid + "?sort='popularity'", function( data ) {
  			//$( ".result" ).html( data );
		});

	});
});

