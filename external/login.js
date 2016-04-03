var DEBUG_EXTENSION_ID = "haalebecldockhghkcgihmodbegimdai";
var EXTENSION_ID = "ffdncpboblmlnkjkcdankfjcdfpdcaie";

function getParams(url, variable) {
  var vars = url.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

function getQueryVariable(variable) {
  var url = window.location.search.substring(1);
  return getParams(url, variable);
}

$(function() {
  var code = getQueryVariable("code");
  $('#code').text("You code is " + code);

  chrome.runtime.sendMessage(EXTENSION_ID, {code: code}, function(response) {
    console.log("Result: " + response.result);
  });

  // for developing and debugging.
  chrome.runtime.sendMessage(DEBUG_EXTENSION_ID, {code: code}, function(response) {
    console.log("Result: " + response.result);
  });
});
