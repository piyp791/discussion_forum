/*name: home.js*/
/*description: javascript code for home.ejs file*/
/*author: ppapreja*/


//gets home page links for the 3 tabs (recommended, latest and trending)
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

//handles population of latest tab by requesting /getlatest api when clicked on latest tab
$(document).ready(function(){
    $('input[name="tab-group"]').change(function(){
        if($('#latest-tab').prop('checked')){
            
            $.get( "/getlatest" , function( data ) {
            	//console.log(JSON.stringify(data));
            	$('#latest-content').html("")
            	getHomeLinks(data, 'latest-content')
            	//$('#latest-content').html(JSON.stringify(data))
            });
            
        }
    });

    $('input[name="tab-group"]').change(function(){
        if($('#recommended-tab').prop('checked')){

            //console.log('clicked');
            //get logged in user from localstorage
            var loggedInUser = localStorage.getItem("userid");
            console.log('logged in user-->' +loggedInUser);
            if(loggedInUser && loggedInUser!=''){

                $.get( "/getrecommended/"+loggedInUser , function( data ) {
                    console.log(JSON.stringify(data));
                    //$('#latest-content').html("")
                    //getHomeLinks(data, 'latest-content')
                    //$('#latest-content').html(JSON.stringify(data))
                });

            }else{

                 $.get( "/getrecommended/-1" , function( data ) {
                    console.log('response from recommendation api->' +JSON.stringify(data));
                    $('#recommended-content').html("");
                    getHomeLinks(data, 'recommended-content');
                    //$('#latest-content').html(JSON.stringify(data))
                 });

            }
        }
    });
});