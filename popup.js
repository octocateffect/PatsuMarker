// callback should take one arguments.
function getCurrentPageUrl(callback) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, callback);
}

$(function() {
  $('#add').click(function() {
    $('#log').text("Pressed Add button");
    getCurrentPageUrl(function(tabs) {
      var url = tabs[0].url;
      requestAddRepo("charliet", url);
    });
  });
});

$(function() {
  $('#remove').click(function() {
    $('#log').text("Pressed Remove button");
    getCurrentPageUrl(function(tabs) {
      var url = tabs[0].url;
      requestRemoveRepo("charliet", url);
    });
  });
});

$(function() {
  var myid = chrome.runtime.id;
  var loginUrl = "chrome-extension://" + myid + "/login.html";
  var url = "https://github.com/login/oauth/authorize?scope=user:email&redirect_uri=" + loginUrl + "&client_id=69a3094c924ec03f2f3c";
  $('#login').click(function() {
    chrome.tabs.create({url: url});
  })
});
