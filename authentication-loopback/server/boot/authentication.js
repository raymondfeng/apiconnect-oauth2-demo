'use strict';

var basicAuth = require('basic-auth');

module.exports = function enableAuthentication(server, done) {
  var User = server.loopback.User;

  var auth = function(req, res, next) {
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    };

    var user = basicAuth(req);

    if (!user) {
      return unauthorized(res);
    }

    User.login({
      username: user.name,
      password: user.pass
    }, function(err, accessToken) {
      if (err) return unauthorized(res);
      else {
        console.log('Login is successful: %s', user.name);
        res.status(200).send(accessToken.id);
      }
    });

  };

  server.get('/authenticate', auth);
  server.post('/authenticate', auth);

  User.create([
    {username: 'foo', password: 'bar', email: 'foo@example.com'},
    {username: 'nameA', password: 'passA', email: 'nameA@example.com'}
  ], done);

};
