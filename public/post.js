/*name: post.js*/
/*description: javascript code for all posts files.*/
/*author: ppapreja*/

/*TO-DO*/
/*1. implement ajax request for comment posting.*/

/*implements popover opening on comment button click.*/
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

    		return "<div id = contentcheck><p id = 'okaytext' style = 'font-color:green;'>Looks OK</p></div> <div id = 'similaritydiv'><label><input  class = 'sample' id='similaritycheckbox' type='checkbox' /> Are you sure your comments isn't just a \"Me too!\", \"thanks\", or \"+1\"? </label></div><button type='button' id = 'postcmtbtn'  class='popovercomment btn btn-primary btn-block' onclick = \'publishcomment()\'>Post Question</button><div id = 'faqlink'><p>Here\'s some more info about posting questions.</p></div>"

    	}else{
    		return "<div id = contentcheck><p id = 'notokaytext' style = 'font-color:red;'>Fix Needed</p></div> <div id = 'similaritydiv'><label><input  class = 'sample' id='similaritycheckbox' type='checkbox' /> Are you sure your comments isn't just a \"Me too!\", \"thanks\", or \"+1\"? </label></div><button type='button' id = 'postcmtbtn'  class='popovercomment btn btn-primary btn-block' onclick = \'publishcomment()\'>Post Question</button><div id = 'faqlink'><p>Here\'s some more info about posting questions.</p></div>"
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

$(document).ready(function(){

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

/*populates resources (links extracted from the page into the resources window pane)*/
function populateResources(content){
    //var content = $('.content').html();
    //console.log('content' +content);
    var index = 0;
    
    startindex = 0;
    endindex = 0;

    var list = document.createElement('ul');
    var resourcestab = document.getElementById('resourcescontent');
    resourcestab.appendChild(list);

    while(startindex!=-1){

        startindex = content.indexOf("<a", index);
        console.log(startindex)

        if(startindex==-1){
            continue;
        }
        endindex = content.indexOf("</a>", startindex);
        console.log(endindex)
        var link = content.substring(startindex, endindex);
        console.log('link-->' +link +  ' length-->' +link.length);
        

        if(link!="" && link.length>0 && link.includes('href')){
           var el = document.createElement('li');
            list.appendChild(el);
            el.innerHTML = link;
            list.append(document.createElement('br')); 
        }
        

        index = endindex+1;
    }
}

function getHighlights(){

    var title = $(document).attr('title')

     $.get( "/getHighlights", {'title' : title}, function( data ) {

        console.log(JSON.stringify(data))

        for(var text of data){
            $('#pagebody').highlight(text.Text);
        }
     });
}