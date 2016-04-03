// This should be your login page.
var LOGIN_PAGE = "http://chatea.github.io/githubbookmark/login.html";
var CLIENT_ID = "69a3094c924ec03f2f3c";
var CLIENT_SECRET = "1f61aebd0ae66a0be038fb872231745e239088c0";

// callback should take one arguments.
function getCurrentPageUrl(callback) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, callback);
}

function getParams(url, variable) {
  var vars = url.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

function getUser(token, successCallback, failedCallback) {
  var userApi = "https://api.github.com/user?access_token=" + token;
  $.ajax({
    url: userApi,
    type: 'GET',
    success: function(data) {
      successCallback(data);
    },
    error: function() {
      console.log('Error: Cannot get user');
      failedCallback();
    }
  });
}

function requestAccesstoken(code) {
  var url = "https://github.com/login/oauth/access_token";
  $.ajax({
    url: url,
    data: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    },
    type: 'POST',
    success: function(data) {
      var token = getParams(data, "access_token");
      saveToken(token);
    },
    error: function() {
      console.log('Error: Cannot get token');
    }
  });
}

function saveToken(token) {
  if (!token) {
    console.log("Error: There is no token");
    return;
  }

  chrome.storage.sync.set({"token": token}, function() {
    console.log('Token saved');
    setLogginned(token);
  });
}

function getToken(callback) {
  chrome.storage.sync.get("token", function(items) {
    callback(items.token);
  });
}

function login() {
  var url = "https://github.com/login/oauth/authorize?scope=user:email&redirect_uri=" + LOGIN_PAGE + "&client_id=" + CLIENT_ID;
  chrome.tabs.create({url: url});
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    if (key == "token") {
      var storageChange = changes[key];
      if (!storageChange.oldValue && storageChange.newValue) {
        showAsLogin();
      }
    }
  }
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    var code = request.code;
    sendResponse({result: "OK"});

    requestAccesstoken(code);
  }
);

function isGithubRepoUrl(url) {
  var patt = new RegExp("^https://github.com/[a-zA-Z0-9._\-]+/[a-zA-Z0-9._\-]+$");
  var res = patt.exec(url);
  return res? true: false;
}

function setClickEvents(id) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var url = tabs[0].url;
    console.log("url: " + url);

    // only show add/remove button on github page
    if (isGithubRepoUrl(url)) {
      $('#add').click(function() {
        requestAddRepo(id, url);
      });
      $('#remove').click(function() {
        requestRemoveRepo(id, url);
      });
    } else {
      $('#add').css("visibility", "hidden");
      $('#remove').css("visibility", "hidden");
    }
  });
}

function setLogginned(token) {
  getUser(token, function(data) {
    setClickEvents(data.id);
  }, function() {
    console.log("Cannot get user");
  });
  $('#loginned').css("visibility", "visible");
  $('#non-loginned').css("visibility", "hidden");
}

$(function() {
  $('#logo').click(function() {
    openWebPage();
  })
})

$(function() {
  $('#login').click(function() {
    console.log("click login...");
    login();
  });
});

$(function() {
  console.log("get token...");
  getToken(function (token) {
    if (token) {
      setLogginned(token);
    } else {
      $('#loginned').css("visibility", "hidden");
      $('#non-loginned').css("visibility", "visible");
    }
  });
});
