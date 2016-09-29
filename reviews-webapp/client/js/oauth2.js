var CLIENT_ID = '6995f2b2-7ddd-4c82-8099-7a5ac532265f';
var CLIENT_SECRET = 'rF3jY0dX5qF3gL7cN5uC5tH3dI0nJ5vP5wM7xS7hI8eE6oM5qJ';
var clientRegistrationLoaded = false;
var baseUrl = 'https://api.us.apiconnect.ibmcloud.com/rfengusibmcom-dev/sb/oauth-provider';
var tokenEndpoint = baseUrl + '/oauth2/token';
var authEndpoint = baseUrl + '/oauth2/authorize';

// implicit flow

function implicit(clientId, scope) {
  scope = scope || 'review';

  var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri='
    + getRedirectURI() + '&response_type=token&scope=' + scope + '&state=123';

  if (confirm('Redirecting to: ' + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

// authorization code flow

function getAuthorizationCode(clientId, scope) {
  scope = scope || 'demo';

  var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri='
    + getRedirectURI() + '&response_type=code&scope=' + scope + '&state=123';

  if (confirm('Redirecting to: ' + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

function getCode() {
  return getQueryParam('code');
}

function getTokenByCode(clientId, clientSecret, code, successCallback) {
  var data = 'code=' + code + '&grant_type=authorization_code&client_id='
    + clientId + '&client_secret=' + clientSecret + '&redirect_uri='
    + getRedirectURI();

  $.post(tokenEndpoint, data, successCallback);
}

// client credentials flow

function getTokenByClientCredentials(clientId, clientSecret, username, scope,
    successCallback, errorCallback) {
  scope = scope || 'demo';

  var data = 'grant_type=client_credentials&client_id=' + clientId
    + '&client_secret=' + clientSecret + '&scope=' + scope;

  if (username)
    data += '&username=' + username;

  $.post(tokenEndpoint, data, successCallback)
    .error(errorCallback);
}

// resource owner password credentials flow

function getTokenByResourceOwnerPasswordCredentials(clientId, clientSecret,
    username, password, scope, successCallback, errorCallback) {
  scope = scope || 'demo';

  var data = 'grant_type=password&client_id=' + clientId + '&client_secret='
    + clientSecret + '&username=' + username + '&password=' + password
    + '&scope=' + scope;

  $.post(tokenEndpoint, data, successCallback)
    .error(errorCallback);
}

// util

function hasQueryStrParams() {
  var queryStr = window.location.search;
  params = queryStr ? queryStr.substring(1).split('&') : [];
  return params.length !== 0;
}

function hasFragment() {
  return window.location.hash.length !== 0;
}

function getUrlWithToken(url, token) {
  return url + '?client_id=' + CLIENT_ID + '&access_token=' + token;
}

function displayMessage(msg) {
  updateHtml('msg', msg);
}

function updateHtml(id, html) {
  $("#" + id).html(html);
}

function getRedirectURI() {
  return encodeURIComponent('https://localhost:3001' + location.pathname);
}

function appendHtml(id, html) {
  var current = $("#" + id).html();
  current = current ? current + html : html;
  $("#" + id).html(current);
}

function updateJson(id, jsonObject) {
  $("#" + id).html(JSON.stringify(jsonObject));
}

function getQueryParam(name) {
  var query = location.search;
  var parameters = [];
  if (query !== null && query !== '') {
    parameters = query.substring(1).split('&');
  }

  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].indexOf(name + '=') === 0) {
      var code = parameters[i].substring(name.length + 1);
      return code;
    }
  }
  return null;
}

function getAccessToken() {
  if (location.hash.length !== 0) {
    var accessToken = location.hash.substring(1);
    var index = accessToken.indexOf('access_token=', 0);
    var endIndex = accessToken.indexOf('&', index + 13);
    if (endIndex === -1)
      endIndex = accessToken.length() - 1;
    var oAuthToken = accessToken.substring(index + 13, endIndex);
    return oAuthToken;
  }
  return null;
}

function introspect(token, clientId, clientSecret, cb) {
  clientId = clientId || CLIENT_ID;
  clientSecret = clientSecret || CLIENT_SECRET;

  var settings = {
    "async": true,
    "crossDomain": true,
    crossOrigin: true,
    "url": "https://api.us.apiconnect.ibmcloud.com/rfengusibmcom-dev/sb/oauth-provider/oauth2/introspect",
    "type": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "x-ibm-client-id": clientId,
      "x-ibm-client-secret": clientSecret,
      "cache-control": "no-cache"
    },
    "data": {
      "token": token,
      "token_type_hint": "access_token"
    }
  };

  $.ajax(settings).done(cb);
}


function getReviews(token, clientId, clientSecret, cb) {
  clientId = clientId || CLIENT_ID;
  clientSecret = clientSecret || CLIENT_SECRET;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.us.apiconnect.ibmcloud.com/rfengusibmcom-dev/sb/api/reviews",
    "type": "GET",
    "headers": {
      "content-type": "application/json",
      "x-ibm-client-id": clientId,
      "x-ibm-client-secret": clientSecret,
      "authorization": "Bearer " + token,
      "cache-control": "no-cache"
    }
  };
  $.ajax(settings).done(cb);
}