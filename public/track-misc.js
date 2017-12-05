var URL = "https://user-tracking-node.herokuapp.com/";

function getCurrentTime(){

    return Date.now();

}

function callServer(url, method, parameters){

    console.log('Call to server made...');
    console.log('parameters' +JSON.stringify(parameters));

    if (method === 'GET'){
        $.get(url, parameters, function(data) {});
    }else{
        $.post(url, parameters, function(data) {
            //handle response
            //if successful, empty the array
            //serverData.events = [];
            localStorage.removeItem("events");
            localStorage.setItem('startTime', new Date().getTime()/1000)
        });
    }
}

function updateEventStats(event, events){

    if(event.type === 'click'){


        if(events.stats.links){
            events.stats.links +=1;
        }else{
            events.stats.links =1;
        }

    }else if(event.type === 'upvote'){

        if(events.stats.upvotes){
            events.stats.upvotes +=1;
        }else{
            events.stats.upvotes =1;
        }
    }else if(event.type === 'downvote'){

        if(events.stats.downvotes){
            events.stats.downvotes +=1;
        }else{
            events.stats.downvotes =1;
        }

    }else if(event.type === 'copy-event'){

        if(events.stats.copyevents){
            events.stats.copyevents +=1;
        }else{
            events.stats.copyevents =1;
        }
    }

    return events.stats;
}

function saveToLocalStorage(event){

    var events = localStorage.getItem('events')
    //alert('events ::' + events)

    if(!events || events === null){
        events = {'info': [], 'stats': {}}
    }else{
        events = JSON.parse(events);
    }

    if(event!=null && event!=undefined){
        events.info.push(event);
        //update stats here
        var stats = updateEventStats(event, events)
        events.stats = stats
    }

    //alert(JSON.stringify(events))
    localStorage.setItem('events', JSON.stringify(events))


    //check time
    //if current time - db time > 60?send to DB:do nothing
    var currentTimeInSec = new Date().getTime()/1000;
    var startTime = parseInt(localStorage.getItem('startTime'),  10); // parseInt with radix (decimal)
    if(currentTimeInSec - startTime >15 || (event == null || event == undefined )){

        //send the request to DB
        var serverUrl = URL + '/saveData';
        var param = {'data': localStorage.getItem('events')};

        callServer(serverUrl, 'POST', param);
    }

}


function startTimer(){

    var currentDateTime = new Date();
    var currentDateTimeInSec = currentDateTime.getTime()/1000;

    //store time in DB
    //saveToDB(currentDateTimeInSec);
    localStorage.setItem('startTime', currentDateTimeInSec)
    localStorage.setItem('isTimerSet', 'true')
}
