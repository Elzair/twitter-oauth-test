
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');

var OAuth= require('oauth').OAuth;

var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    "0fuAfly9ohR6zcJiT7dMg",
    "80l3r0p2ZU9jDSMn2gPDcDSp8Hpg1hsMghC4iKQyYg",
    "1.0",
    "http://elzair.oauth-test.jit.su/auth/twitter/callback",
    "HMAC-SHA1"
);

express.request.oa = express.response.oa = oa;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/twitter', user.authenticate);
app.get('/auth/twitter/callback', user.callback);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
