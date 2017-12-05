// this is the code which will be injected into a given page...
//var URL = "https://70967111.ngrok.io";
var MAX_MOUSE_DATA_POINTS = 50;
var MAX_SCROLL_DATA_POINTS = 30;

var DOWN_VOTE_EVENT = 'downvote'
var UP_VOTE_EVENT = 'upvote'
var COPY_EVENT = 'copy-event'

var currentUserId = -1;

//setInterval(function(){ saveToLocalStorage(null) }, 30000);


(function() {

    var currentUrl = window.location.href;
    if (currentUrl.startsWith("https://stackoverflow")) {


        'use strict';

        //check for local storage initialization

        console.log('local storage parameter--->' + localStorage.getItem('isTimerSet'))
        if(localStorage.getItem('isTimerSet') != 'true'){
            console.log('initializing timer')
            //initDB()
            startTimer()
        }

        //check for tab/browser close events
        window.addEventListener("beforeunload", function (e) {
            saveToLocalStorage(null)
        });


        //captures left click event
        document.addEventListener('click', function(evt) {

            mytarget = evt.target.toString();
            console.log(mytarget);

            if(mytarget.indexOf("https://stackoverflow")!=-1){

                var datetime = getCurrentTime();
                var event = { 'id': 'click-' +  datetime, 'datetime': datetime, 'type' : 'click', 'value': mytarget }
                saveToLocalStorage(event)
            }


        }, true);

        //captures right click event
        document.addEventListener('contextmenu', function(ev) {
            //ev.preventDefault();
            //alert('success!');
            //return false;
        }, false);

        //captures mouse movements
        var xy_list = [];

        function tellPos(p) {
            var cd = [];
            cd.push(p.pageX);
            cd.push(p.pageY);

            var m_seconds  =getCurrentTime();
            //var m_seconds = new Date().getTime() / 1000;
            cd.push(m_seconds);
            xy_list.push(cd);

            if (xy_list.length == MAX_MOUSE_DATA_POINTS) {
                console.log('250 up!!');
                console.log(xy_list);


                var datetime = getCurrentTime();
                var event = { 'id': 'm_movement-' + datetime, 'datetime': datetime, 'type' : 'mouse-movement', 'value': xy_list}
                //serverData.events.push(event)
                saveToLocalStorage(event)

                xy_list = [];
            }
        }

        document.addEventListener('mousemove', tellPos, false);


        //captures scroll movements
        var checkScrollSpeed = (
            function(settings) {
                settings = settings || {};
                var lastPos, newPos, timer, delta, delay = settings.delay || 50;

                function clear() {
                    lastPos = null;
                    delta = 0;
                }

                clear();
                return function() {
                    newPos = window.scrollY;
                    if (lastPos != null) {
                        delta = newPos - lastPos;
                    }
                    lastPos = newPos;

                    clearTimeout(timer);

                    timer = setTimeout(clear, delay);
                    return delta;
                };
            }
        )();

        var scroll = [];
        window.onscroll = function() {
            var cs = [];
            var current_scroll = checkScrollSpeed();
            console.log(current_scroll);
            var s_seconds = getCurrentTime();
            //var s_seconds = new Date().getTime() / 1000;
            cs.push(current_scroll);
            cs.push(s_seconds);

            //push url information as well....
            cs.push(window.location.href);

            scroll.push(cs);
            if (scroll.length == MAX_SCROLL_DATA_POINTS) {
                console.log('sending 100 data points to server');
                var datetime = getCurrentTime();
                var event = { 'id': 's_movement-' + datetime, 'datetime': datetime, 'type' : 'scroll-movement', 'value': scroll}
                saveToLocalStorage(event)
                scroll = []
            }
        };

        //captures save , copy events
        var isCtrl = false;
        document.onkeyup = function(e) {
            if (e.keyCode == 17) {
                isCtrl = false;
            }
        };

        document.onkeydown = function(e) {
            if (e.keyCode == 17) {
                isCtrl = true;
            }
            if (e.keyCode == 83 && isCtrl == true) {
                /*console.log('Ctrl s alert');
                console.log(window.location.href);
                $.get(URL + SAVE_API, {
                    'link': window.location.href,
                    'timestamp': getCurrentTime()
                    //'timestamp': new Date().getTime() / 1000
                }, function(data) {});*/
            } else if (e.keyCode == 67 && isCtrl == true) {

                var url = window.location.href;
                var datetime = getCurrentTime();
                var event = { 'id': 'copy-' +  datetime, 'datetime': datetime, 'type' : COPY_EVENT, 'link': url  }
                saveToLocalStorage(event)
            }
        }


        //captures upvotes, downvotes
        var upvote = document.getElementsByClassName("vote-up-off");
        var downvote = document.getElementsByClassName("vote-down-off");

        var captureUpVote = function() {
            console.log("up voted");

            //capture current url
            var url = window.location.href;
            var datetime = getCurrentTime();
            var event = { 'id': 'vote-' +  datetime, 'datetime': datetime, 'type' : UP_VOTE_EVENT, 'link': url  }
            //serverData.events.push(event)
            saveToLocalStorage(event)


        };

        var captureDownVote = function() {
            console.log("down voted");

            //capture current url
            var url = window.location.href;
            var datetime = getCurrentTime();
            var event = { 'id': 'vote-' +  datetime, 'datetime': datetime, 'type' : DOWN_VOTE_EVENT, 'link': url  }
            //serverData.events.push(event)
            saveToLocalStorage(event)
        };

        for (var i = 0; i < upvote.length; i++) {
            upvote[i].addEventListener('click', captureUpVote, false);
        }

        for (var i = 0; i < downvote.length; i++) {
            downvote[i].addEventListener('click', captureDownVote, false);
        }

    }else if(currentUrl.startsWith("https://localhost/login")){
        //user id handling

    }

})();