/*name: textaudit.js*/
/*description: javascript code for all posts files handling comment text checking.*/
/*author: ppapreja*/

/*TO-DO*/
/*1. figure out why porter stemmer is not working.*/

/*utility function for calculating smilarity between two stings*/
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


/*function for calculating distance between two stings based on Levenshtein distance */
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/*wrapper function for similarity() function, which applies porter-stemmer on input words before*/
/*pasing the input onto the similarity function*/
function checkSimilarity(textinput, blockedword){

  //apply porter stemmer algorithm
  var stemtext = stemmer(textinput);
  var stemmedblockedword = stemmer(blockedword);
  console.log('stemmed input text-->' + stemtext + ', stemmed blockedword-->' + stemmedblockedword)
  var similarityresult = similarity(textinput, blockedword);
  return similarityresult;
}