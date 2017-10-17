$(function() {
    $('.trigger').popover({
        html: true,
        title: function () {
            return $(this).parent().find('.head').html();
        },
        content: function () {
            return $(this).parent().find('.content').html();
        }
    });
    
    $('body').on('click', '.sample', function(){
        
        $('input[type="checkbox"][id="problemstmtcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
               $("#settingdiv").fadeIn(500);
               //$("#settingdiv").attr("style", "visibility: block")
           }
          });
         $('input[type="checkbox"][id="settingcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
                $("#problemdiv").fadeIn(500);
               //$("#problemdiv").attr("style", "visibility: block")
           }
          });
         $('input[type="checkbox"][id="problemcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
                $("#trialdiv").fadeIn(500);
               //$("#trialdiv").attr("style", "visibility: block")
           }
         });
         $('input[type="checkbox"][id="trialcheckbox"]').change(function() {
           if(this.checked) {
               // do something when checked
               //$("#trialdiv").fadeIn(500);
              $("#postbtn").prop('disabled', false);
           }
 				});
    });
    
});