function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
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
    type: 'GET',
    success: function(data) {
      callback(data["login"]);
    },
    error: function() {
      $('#log').text('An error occurred');
    }
  });
}

function getUserId(token, callback) {
  var userApi = "https://api.github.com/user?access_token=" + token;
  $.ajax({
    url: userApi,
    type: 'GET',
    success: function(data) {
      callback(data["id"]);
    },
    error: function() {
      $('#log').text('An error occurred');
    }
  });
}

function requestAccesstoken(code) {
  var url = "https://github.com/login/oauth/access_token";
  $.ajax({
    url: url,
    data: {
      client_id: "69a3094c924ec03f2f3c",
      client_secret: "1f61aebd0ae66a0be038fb872231745e239088c0",
      code: code
    },
    type: 'POST',
    success: function(data) {
      // var token = data["access_token"];
      var token = getParams(data, "access_token");
      $('#token').text("Token is " + token);

      var userCallback = function(username) {
        $('#user').text("User is " + username);
      };

      var idCallback = function(id) {
        $('#id').text("User id is " + id);
      };

      getUser(token, userCallback);
      getUserId(token, idCallback);
    },
    error: function() {
      $('#log').text('An error occurred');
    }
  });
}

$(function() {
  var code = getQueryVariable("code");
  $('#code').text("You code is " + code);
  requestAccesstoken(code);
})
