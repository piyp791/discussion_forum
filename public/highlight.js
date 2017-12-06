console.log('*******************first line of code....********************');

if (!window.x) {
    x = {};
}

x.Selector = {};
x.Selector.getSelected = function() {
    var t = '';
    if (window.getSelection) {
        t = window.getSelection();
    } else if (document.getSelection) {
        t = document.getSelection();
    } else if (document.selection) {
        t = document.selection.createRange().text;
    }
    //window.selectedtext = t;
    //alert(selectedtext)
    return t;
}

var pageX;
var pageY;

window.finalSelectedText = '';
window.elementMouseIsOver = null;
window.parentPost = null;
$(document).ready(function() {
    console.log('*********************document ready called*********************');
    $(document).bind("mouseup", function() {

        //alert("post select function called....");
        var selectedText = x.Selector.getSelected();
        selectedText = selectedText.toString();
        //alert('selected text-->' +selectedText + ' final selectedtext-->' +finalSelectedText);
        if(selectedText != ''){
            elementMouseIsOver = document.elementFromPoint(pageX, pageY);
            console.log(elementMouseIsOver);
            var element;
            element = elementMouseIsOver;
            while(element.parentNode) {
                //display, log or do what you want with element
                element = element.parentNode;
                //console.log(element);
                if(element.className == "post"){
                    console.log(element);
                    window.parentPost = element;
                    break;
                }
            }
            window.finalSelectedText = selectedText;
            $('ul.tools').css({
                'left': pageX + 5,
                'top' : pageY - 55
            }).fadeIn(200);
        } else {
            $('ul.tools').fadeOut(200);
        }
    });

    $(document).on("mousedown", function(e){
        pageX = e.pageX;
        pageY = e.pageY;
    });

    $('ul.tools li').click(function(e)
    {
     //rest api call to store this information.
        var elementhtml =  $(this).html();
        console.log('element html->', elementhtml);
        if(elementhtml!=null && elementhtml== 'Cmt'){

            console.log('comment button pressed');
            // on press of comment button, close the pop up and open another popup.
            $('ul.tools').fadeOut(200);
            $('div .comment_tools').css({
                'left': e.pageX + 5,
                'top' : e.pageY - 55
            }).fadeIn(200);

        }else if(elementhtml!=null && elementhtml== 'H'){

            var id;
            console.log('highlight button pressed');
            console.log('finalselected text-->' +finalSelectedText);
            console.log(parentPost);
            console.log('id-->' +parentPost.id);
            if(parentPost && parentPost.id){
                console.log('parent post id-->' +parentPost.id);
                $.post( "/highlight", {'title' :  $(document).attr('title'), 'text': finalSelectedText, 'parentID': parentPost.id }, function( data ) {
                    console.log('data-->' +JSON.stringify(data));
                    if(data.status == 'success'){
                        $('#pagebody').highlight(finalSelectedText);

                        $('div .reward_tools').css({
                            'left': e.pageX + 5,
                            'top' : e.pageY - 55
                        }).fadeIn(1500);

                        $('div .reward_tools').fadeOut(1500);

                        //clear highlights pane
                        getHighlights();
                        //show selected comment in the highlights tab
                        setHighlightHovers();



                    }else{
                        alert('some problem saving the highlight!!!');
                    }
                });
            }
        }
    });
});