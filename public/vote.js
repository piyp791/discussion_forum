var callback = function(data) {

    console.log('vote data' + data.upvoted)
    console.log('vote id -->' + data.id)
    /*$.ajax({
        url: '/vote',
        type: 'post',
        data: { id: data.id, up: data.upvoted, down: data.downvoted, star: data.starred }
    });*/
};

//get list of questions
$("div[class='upvote']").each( function () {
  //$(this).val( $(this).attr("data-toggle", "collapse") );
  console.log(this.id + '  div found')
  var divid = this.id;

  var numericId = divid.substring(divid.indexOf('-')+1)
  console.log(numericId + '  numeric id')
  $('#' +divid).upvote({id: numericId, callback: callback});
});