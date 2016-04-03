// This should be your login page.
var LOGIN_PAGE = "http://chatea.github.io/githubbookmark/login.html";
var CLIENT_ID = "69a3094c924ec03f2f3c";
var CLIENT_SECRET = "1f61aebd0ae66a0be038fb872231745e239088c0";

var TOKEN = "token";

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

function getUser(token, callback) {
  var userApi = "https://api.github.com/user?access_token=" + token;
  $.ajax({
    url: userApi,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    type: 'GET',
    success: function(data) {
      callback(data);
    },
    error: function() {
      message('Error: Cannot get user');
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
      // var token = data["access_token"];
      var token = getParams(data, "access_token");

      saveToken(token);
      // var userCallback = function(data) {
      //   $('#user').text("User is " + data["login"]);
      //   $('#id').text("User id is " + data["id"]);
      // };

      getUser(token, userCallback);
    },
    error: function() {
      message('Error: Cannot get token');
    }
  });
}

function saveToken(token) {
  if (!token) {
    message("Error: There is no token");
    return;
  }

  chrome.storage.sync.set({TOKEN: token}, function() {
    message('Token saved');
  });
}

function getToken(callback) {
  chrome.storage.sync.get(TOKEN, function(token) {
    callback(token);
  });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    if (key == TOKEN) {
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

// $(function() {
//   $('#add').click(function() {
//     $('#log').text("Pressed Add button");
//     getCurrentPageUrl(function(tabs) {
//       var url = tabs[0].url;
//       requestAddRepo("charliet", url);
//     });
//   });
// });

// $(function() {
//   $('#remove').click(function() {
//     $('#log').text("Pressed Remove button");
//     getCurrentPageUrl(function(tabs) {
//       var url = tabs[0].url;
//       requestRemoveRepo("charliet", url);
//     });
//   });
// });

function login() {
  var url = "https://github.com/login/oauth/authorize?scope=user:email&redirect_uri=" + LOGIN_PAGE + "&client_id=" + CLIENT_ID;
  chrome.tabs.create({url: url});
  // $('#login').click(function() {
  //
  // });
}

var LoginButton = React.createClass({
  render: function() {
    return (
      React.createElement('button', {type: "button", onClick: "login"},
        "Login"
      )
    );
  }
});

var AddButton = React.createClass({
  render: function() {
    return (
      React.createElement('button', {type: "button", onClick: ""},
        "Add To Bookmark"
      )
    );
  }
});

var RemoveButton = React.createClass({
  render: function() {
    return (
      React.createElement('button', {type: "button", onClick: ""},
        "Remove From Bookmark"
      )
    );
  }
});

var LoginnedPage = React.createClass({
  render: function() {
    return (
      React.createElement(AddButton)
      // TODO React.createElement(RemoveButton)
    )
  }
});

function showAsLoginned(token) {
  ReactDOM.render(
    React.createElement(LoginnedPage),
    document.getElementById('content')
  );
}

function showAsNotLoginned() {
  ReactDOM.render(
    React.createElement(LoginButton, null),
    document.getElementById('content')
  );
}

$(function() {
  getToken(function(token) {
    if (token) {
      showAsLoginned(token);
    } else {
      showAsNotLoginned();
    }
  });
});
