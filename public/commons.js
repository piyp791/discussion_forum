function populateResources(content){

    //var content = $('.content').html();
    //console.log('content' +content);
    var index = 0;
    
    startindex = 0;
    endindex = 0;

    var list = document.createElement('ul')
    var resourcesTab = document.getElementById('resourcestab')
    resourcestab.appendChild(list)

    while(startindex!=-1){

        startindex = content.indexOf("<a", index);
        console.log(startindex)

        if(startindex==-1){
            continue;
        }
        endindex = content.indexOf("</a>", startindex);
        console.log(endindex)
        var link = content.substring(startindex, endindex+1);
        console.log('link-->' +link)
        

        var el = document.createElement('li');
        list.appendChild(el);
        el.innerHTML = link;
        list.append(document.createElement('br'))

        index = endindex+1;
    }

}