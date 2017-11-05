console.log('*******************8first line of code....********************');

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
$(document).ready(function() {
    console.log('*********************document ready called*********************');
    $(document).bind("mouseup", function() {

        //alert("post select function called....");
        var selectedText = x.Selector.getSelected();
        selectedText = selectedText.toString();
        //alert('selected text-->' +selectedText + ' final selectedtext-->' +finalSelectedText);
        if(selectedText != ''){
            //alert('assigning to finalSelectedText');
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
    //alert('final click finalSelectedText-->' +window.finalSelectedText);
     //alert($(this).text());
     //get selected text
     //console.log('final click selected text -->' +finalSelectedText)

     //rest api call to store this information.
        $.post( "/highlight", {'title' :  $(document).attr('title'), 'text': finalSelectedText }, function( data ) {
            console.log('data-->' +JSON.stringify(data))
            if(data.status == 'success'){
                $('#pagebody').highlight(finalSelectedText);
            }else{
                alert('some problem saving the highlight!!!');
            }
        });
     
    });
});