'use strict'

var quesid = '';
let log = console.log.bind(console),

  stream,
  recorder,
  counter=1,
  chunks,
  media;

var mediaOptions = {
        video: {
          tag: 'video',
          type: 'video/webm',
          ext: '.mp4',
          gUM: {video: true, audio: true}
        },
        audio: {
          tag: 'audio',
          type: 'audio/ogg',
          ext: '.ogg',
          gUM: {audio: true}
        }
      };

media = mediaOptions.audio;
console.log('media-->' +media)
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;

    //document.getElementById('start').removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive')  makeLink();
    };
    log('got media successfully');
  }).catch(log);


$(".record-start").click(function(){
  
  var cmtbtnid = this.id
  console.log('button clicked -->' + cmtbtnid)
  quesid = cmtbtnid.substring(cmtbtnid.indexOf('-')+1)

  $('.record-start').attr('disabled', true);
  $('.record-stop').removeAttr( "disabled" )
  chunks=[];
  recorder.start();
});


$(".record-stop").click(function(){
  
  $('.record-stop').attr('disabled', true);
  recorder.stop();
  $('.record-start').removeAttr( "disabled" )

});


function makeLink(){
  let blob = new Blob(chunks, {type: media.type })
    , url = URL.createObjectURL(blob)
    //, li = document.createElement('li')
    , p = document.createElement('p')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
  ;
  mt.controls = true;
  mt.src = url;
  hf.href = url;
  
  p.appendChild(mt);
  p.appendChild(hf);

  //if any element is present before, remove
  var parent = document.getElementById('recording-' + quesid);
  while(parent.hasChildNodes()){
     parent.removeChild(parent.lastChild);
  }
  parent.appendChild(p)
}
