/*name: post.js*/
/*description: javascript code for all posts files.*/
/*author: ppapreja*/

/*implements popover opening on comment button click.*/
"use strict";
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

			var similarityresult = checkSimilarity(text, blockedwords[i]);
			console.log('similarity result to ' +  blockedwords[i] +' -->' +similarityresult)
			if(similarityresult>0.60){
				blockcomment = true;
				break;
			}
		}

  		console.log('block comment -->' + blockcomment)
    	if(blockcomment == false){

    		return "<div id = contentcheck><p id = 'okaytext' style = 'font-color:green;'>Looks OK</p></div> <div id = 'similaritydiv'><label><input  class = 'sample' id='similaritycheckbox' type='checkbox' /> Are you sure your comments isn't just a \"Me too!\", \"thanks\", or \"+1\"? </label></div><button type='button' id = 'postcmtbtn'  class='popovercomment btn btn-primary btn-block' onclick = \'publishcomment()\'>Post Comment</button><div id = 'faqlink'><p>Here\'s some more info about posting comments.</p></div>"

    	}else{
    		return "<div id = contentcheck><p id = 'notokaytext' style = 'font-color:red;'>Fix Needed</p></div> <div id = 'similaritydiv'><label><input  class = 'sample' id='similaritycheckbox' type='checkbox' /> Are you sure your comments isn't just a \"Me too!\", \"thanks\", or \"+1\"? </label></div><button type='button' id = 'postcmtbtn'  class='popovercomment btn btn-primary btn-block' onclick = \'publishcomment()\'>Post Comment</button><div id = 'faqlink'><p>Here\'s some more info about posting comments.</p></div>"
    	}	
    },
    html: true
});



var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function(obj){
  var self = obj instanceof this.constructor ?
    obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
  var container, timeout;

  originalLeave.call(this, obj);

  if(obj.currentTarget) {
    container = $(obj.currentTarget).siblings('.popover')
    timeout = self.timeout;
    container.one('mouseenter', function(){
      //We entered the actual popover – call off the dogs
      clearTimeout(timeout);
      //Let's monitor popover content instead
      container.one('mouseleave', function(){
        $.fn.popover.Constructor.prototype.leave.call(self, self);
      });
    })
  }
};

function setHighlightHovers(){

    $('.highlight').each(function(){


        //console.log(currentelement.html());
        //parentPost = currentelement.parent().closest('div').attr('class','post'); // this gets the parent classes.
        //console.log(parentPost[0]);

        $(this).click(function(e){

            currentelement = $(this);

            console.log(currentelement.html());
            finalSelectedText = currentelement.html();
            parentPost = currentelement.parent().closest('div').attr('class','post'); // this gets the parent classes.
            console.log(parentPost[0]);
            parentPost = parentPost[0];

            $('ul.tools').css({
                'left': e.pageX + 5,
                'top' : e.pageY - 55
            }).fadeIn(200);
        })
    });
}

$(document).ready(function(){

    setHighlightHovers();

    $('[data-toggle="popover"]').popover({

        placement : 'auto',
        trigger : 'hover',
        content: function(){
            console.log(this.id)
            divid = this.id.substring(this.id.indexOf('-')+1).trim();
            console.log('div id-->', divid);

            //extract dictionary from  
            var tagcontentid = 'usertaginfo-' + divid
            console.log('tag content id -->' +tagcontentid)
            var tagcontent = $('#usertaginfo-' + divid).html();
            console.log('tag content -->' +tagcontent)

            tagcontent = tagcontent.replace(/\'/g, "\"")
            console.log('tag content -->' +tagcontent)
            tagcontent = JSON.parse(tagcontent)
        
            mystr = '<div style = "height: 90px;overflow:auto;">';
            mystr = mystr + '<h4>User Reputation</h4>'
            for (var key in tagcontent) {
                if (tagcontent.hasOwnProperty(key)) {
                    console.log(key + " -> " + tagcontent[key]);
                    mystr = mystr + ('<p>' + key + "-" + tagcontent[key] + '<p>')
                }
            }
            mystr += '</div>'
            return mystr;
        },
        html: true,
        trigger: 'click hover', 
        delay: {show: 50, hide: 400}
    })
});


/*final comment posting to be handled from within this function.*/
function publishcomment(){
	console.log('publish comment called');
}

function setOnLinksHover(){
    console.log('set on links hover');

    $(".pagelinks").each( function () {
        var id = $(this).attr('id');
        console.log(id);
        var parentPostid = id.substring(5);
        console.log(parentPostid);

        $(this).hover(function(e){
            //alert('hover');
            console.log('id-->' +id);
            console.log('hover on-->' +parentPostid);
            $("#"+parentPostid)[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                block: "start" // or "end"
            });
        })
    });
}


function setHighlightsParents(){

    console.log('set parents of highlights');

     $(".highlight_parent").each( function () {
        var id = $(this).attr('id');
        console.log(id);
        var parentPostid = id.substring(17);
        console.log(parentPostid);

        $(this).hover(function(e){
            //alert('hover');
            console.log('id-->' +id);
            console.log('hover on-->' +parentPostid);

            $("#"+parentPostid)[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                block: "start" // or "end"
            });
        })
    });
}


function incLikeVote(){

    $('.likehighlight').each(function(){

        var id = $(this).attr('id');
        console.log('like butttons-->' +id);

         $(this).click(function(e){
            //alert('hover');
            console.log('id-->' +id);

            //get text of the highlight
            var el = $(this).parent().find( "p" ).attr( "class", "my_highlight_text" );
            el = el[1]

            console.log('Parent id-->' +id.substring(19))

            console.log(el.innerHTML);

            $.post( "/highlight", {'title' :  $(document).attr('title'), 'text': el.innerHTML, 'parentID': id.substring(19) }, function( data ) {

                 console.log('data-->' +JSON.stringify(data));

                 //increase value of button value
                 var el = el.find( "span" ).attr( "class", "my_highlight_text" );
            });
           
        })

    });
}


/*populates resources (links extracted from the page into the resources window pane)*/
function populateResources(content){

    var linksArray = [];

    var result = $('div')
        .filter(function() {
            var result = this.id.match(/ques/);
            return result;
        });

    console.log(result.attr('id'));

    var quesId = result.attr('id').substring(5);
    console.log('questionid-->' +quesId);

    $.get("/getPageLinks/" +quesId, function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);

        sorterArray = JSON.parse(data);
        sorterArray = sorterArray.sort(function(a,b){ var ascore = a['likes'] + a['dislikes'] + 0.5*a['views'] + 2*a['likes'] - 2.5*a['dislikes']; var bscore = b['likes'] + b['dislikes'] + 0.5*b['views'] + 2*b['likes'] - 2.5*b['dislikes'];return bscore - ascore;});

        console.log('links array-->' +JSON.stringify(sorterArray))

        var index = 0;

        startindex = 0;
        endindex = 0;

        var list = document.createElement('ul');
        var resourcestab = document.getElementById('resourcescontent');
        resourcestab.appendChild(list);

        for(var linkObj of sorterArray){

            var el = document.createElement('li');
            var linkel = document.createElement('a');

            var p = document.createElement('p');
            p.innerHTML = '<b><a class = \'' +  linkObj['class'] + '\' href = "#" id = \'' + linkObj['LinkID'] +  '\'>Parent Post Link.</a></b>';
            p.innerHTML +=  '<span style = "border:solid black 1px; margin-left:8px;"><span style = "padding:5px" class="glyphicon glyphicon-thumbs-up"></span>' +  linkObj['votes'] + '</span>';
            p.style.textAlign = 'left';
            el.appendChild(p);

            el.appendChild(linkel);
            list.appendChild(el);
            linkel.innerHTML = linkObj['href'];
            linkel.href = linkObj['href'];
            linkel.id = linkObj['id'];
            linkel.className = linkObj['class'];

            linkel.appendChild(document.createElement('br'));
            linkel.appendChild(document.createElement('br'));
            var linkinfo = document.createElement('span');
            var linkviews = document.createElement('img');
            linkviews.src = "/eye-con-48.png";
            linkviews.style.height = "20px";
            linkviews.style.width = "20px";
            linkinfo.style.border = "solid black 1px";
            linkinfo.style.marginRight = "8px";
            linkinfo.style.paddingBottom = "5px";
            linkinfo.appendChild(linkviews);
            linkinfo.innerHTML += (" " + linkObj['views'] );

            el.appendChild(linkinfo);

            var like = document.createElement('a');
            like.href = '#';
            like.className = 'btn btn-info btn-sm';
            like.style.marginRight = '8px';

            var likebtn = document.createElement('span');
            likebtn.className = "glyphicon glyphicon-thumbs-up";
            //var randomlikes = Math.floor(Math.random() * randomviews);
            likebtn.innerHTML = linkObj['likes'];

            like.appendChild(likebtn);
            el.appendChild(like);

            var dislike = document.createElement('a');
            dislike.href = '#';
            dislike.className = 'btn btn-info btn-sm';

            var dislikebtn = document.createElement('span');
            dislikebtn.className = "glyphicon glyphicon-thumbs-down";
            //var randomdislikes = Math.floor(Math.random() * randomviews);
            //dislikebtn.innerHTML = randomdislikes;
            dislikebtn.innerHTML = linkObj['dislikes'];

            dislike.appendChild(dislikebtn);
            el.appendChild(dislike);

            list.append(document.createElement('br'));
            list.append(document.createElement('br'));
        }

        setOnLinksHover();

    });
}


function getHighlights(){

    var title = $(document).attr('title');

     $.get( "/getHighlights", {'title' : title}, function( data ) {

        console.log('highlights->'+JSON.stringify(data));

    
         var highlightslist = document.createElement('ul');
         var highlightstab = document.getElementById('highlightcontent');
         highlightstab.innerHTML = "";

         var banner = document.createElement('h3');
         banner.innerHTML = "";
         highlightstab.appendChild(banner);

         highlightstab.appendChild(highlightslist);
        if(!data){
            //click on highlights tab
            //show the banner
            $('a[href="#highlights"]').trigger('click');
            banner.innerHTML = "Mark and Earn!!\n";
            var marker = document.createElement("h4");
            marker.innerHTML = 'Select the best bits from the page and earn reputation points!!';
            highlightstab.appendChild(marker);
        }
        else if(data){

            //rearrange data on the basis of score 
            //calculated on the basis of post rating 
            //and highlight rating
            //sorterArray = JSON.parse(data);
            sorterArray = data.sort(function(a,b){ 
                var ascore = a['NumOfHighlights'] /*+ a['parentscore']*/;  
                var bscore = b['NumOfHighlights'] /*+ b['parentscore']*/;
                return bscore - ascore;
            });

            console.log('sorter array-->'+JSON.stringify(sorterArray));

            var prevID = -1;
            for(var text of sorterArray){
                $('#pagebody').highlight(text.Text);

                //populate the highlighted text in the highlights section

                var currentID = text.ID;

                if(currentID!=prevID && prevID!=-1){
                    var commentarea = document.createElement('textarea');
                    highlightedItem.appendChild(commentarea);
                    var commentbutton = document.createElement('input');
                    commentbutton.type = 'button';
                    commentbutton.value = 'Comment';
                    commentbutton.style.marginLeft = '4px';
                    commentbutton.style.fontSize = 'xx-small';
                    highlightedItem.appendChild(commentbutton);
                }
                if(currentID!=prevID){

                    //add separate post to pane.
                    var parent_id = text.ParentID;
                    voteid = parent_id.substring(parent_id.indexOf('-')+1);
                    console.log('vote id-->' +voteid);
                    voteid = 'vote-' +voteid;
                    console.log('vote id-->' +voteid);
                    var votecount = $("#" +voteid).find("span").html();
                    console.log('votecount=->' +votecount);


                    prevID = currentID;
                    var highlightedItem = document.createElement('li');


                    var p = document.createElement('p');
                    p.innerHTML = '<b><a class =  "highlight_parent" href = "#" id = \'highlight_parent-' + text.ParentID +  '\'>Parent Post Link.</a></b>';
            p.innerHTML +=  '<span style = "border:solid black 1px; margin-left:8px;"><span style = "padding:5px" class="glyphicon glyphicon-thumbs-up"></span>' +  votecount + '</span>';
            p.style.textAlign = 'left';
            highlightedItem.appendChild(p);

                  

                    var highlightText = document.createElement('p');
                    highlightText.innerHTML = text.Text;
                    highlightText.className = 'my_highlight_text';


                    highlightedItem.appendChild(highlightText);
                    highlightslist.appendChild(highlightedItem);

                    highlightedItem.append(document.createElement('br'));

                    var like = document.createElement('a');
                    like.href = '#';
                    like.className = 'btn btn-info btn-sm';
                    like.style.marginRight = '8px';
                    like.classList.add('likehighlight');
                    like.id = 'like-highlight-btn-' +text.ParentID;
                    

                    var likebtn = document.createElement('span');
                    likebtn.className = "glyphicon glyphicon-thumbs-up";
                    likebtn.innerHTML = text.NumOfHighlights;

                    highlightedItem.append(document.createElement('br'));

                    like.appendChild(likebtn);
                    highlightedItem.appendChild(like);

                    if(text.Comment!=null){
                        var comment = document.createElement('p');
                        comment.innerHTML = text.Comment;
                        comment.style.fontSize = 'xx-small';
                        highlightedItem.appendChild(comment);
                    }

                    highlightedItem.append(document.createElement('br'));
                }else{
                    //add comment to current post.
                    var commenttext = text.Comment;
                    console.log('adding comment to previous post.');
                    var comment = document.createElement('p');
                    comment.innerHTML = text.Comment;
                    comment.style.fontSize = 'xx-small';
                    highlightedItem.appendChild(comment);
                }
            }

            setHighlightsParents();

            incLikeVote();
        }
     });
}