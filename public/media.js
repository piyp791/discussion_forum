var final_transcript = '';
var recognizing = false;
var ignore_onend;
//var start_timestamp;

var quesid;
if (!('webkitSpeechRecognition' in window)) {
  //NO GO!!!!
  console.log('here!!!!')

} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    document.getElementById('start_img-'+quesid).src = '/mic-animate.gif'
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      document.getElementById('start_img-'+quesid).src = '/mic.gif';
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      document.getElementById('start_img-'+quesid).src = '/mic.gif';
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
    
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    document.getElementById('start_img-'+quesid).src = '/mic.gif';
    if (!final_transcript) {
      //showInfo('info_start');
      return;
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    
    console.log('final_transcript-->' +final_transcript)
    console.log('interim_transcript-->' +interim_transcript)
    document.getElementById('speech-'+quesid).value = final_transcript;
  };
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}


$(".record-start").click(function(){
  
  var cmtbtnid = this.id
  console.log('button clicked -->' + cmtbtnid)
  quesid = cmtbtnid.substring(cmtbtnid.indexOf('-')+1)

  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = "en-US";
  //recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;

  document.getElementById('start_img-'+quesid).src = '/mic-slash.gif';
});