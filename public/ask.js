/*name: ask.js*/
/*description: javascript code for ask.ejs file.*/
/*author: ppapreja*/


/*TO-DO*/
/*1. ajax request for question posting on post button click from popover*/ 

//handling of maximum length for title of question
$("#question_title").on('input', function() {
			if ($(this).val().length>=100) {
        alert('You have reached the maximum word limit.');       
    }     
	});

//popover implementation on click of ask question button
$("#askbtn").popover({
    title: '<h3 class="custom-title"><span class="glyphicon glyphicon-info-sign"></span> You\'re almost there!</h3>',
    content : "<div id = 'problemstmtdiv'><label><input  class = 'sample' id='problemstmtcheckbox' type='checkbox' /> Have you explained what is it exactly that you want ?</label></div><div id = 'settingdiv'  style='display:none;'><label><input  class = 'sample' id='settingcheckbox' type='checkbox' />Explained the Problem Setting ?</label></div><div id = 'problemdiv' style='display:none;'><label><input  class='sample' id='problemcheckbox' type='checkbox' /> Explained where you got stuck ?</label></div><div id = 'trialdiv' style='display:none;'><label><input  class = 'sample' id='trialcheckbox' type='checkbox' /> Explained what have you tried so far and why did\'t it work? </label></div><button type='button' id = 'postbtn' class='btn btn-primary btn-block' disabled>Post Question</button><div id = 'faqlink'><p>Here\'s some more info about posting questions.</p></div>",
    html: true
}); 

//handling of display of checkboxes in popover before the question gets posted.
$(function() {

    $('body').on('click', '.sample', function(){

        $('input[type="checkbox"][id="problemstmtcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
               $("#settingdiv").fadeIn(500);
           }
          });
         $('input[type="checkbox"][id="settingcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
                $("#problemdiv").fadeIn(500);
           }
          });
         $('input[type="checkbox"][id="problemcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
                $("#trialdiv").fadeIn(500);
           }
         });
         $('input[type="checkbox"][id="trialcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
              $("#postbtn").prop('disabled', false);
              
              //ajax request
           }
         });
    });

});

/***** Dismiss all popovers by clicking outside  **************/
$(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
            (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
        }

    });
});