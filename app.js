
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var OAuth= require('oauth').OAuth
  , fs = require('fs')
  , consumer = JSON.parse(fs.readFileSync('oauth/consumer.json', 'utf8')); 

var app = express();

app.configure(function(){
  //app.set('port', process.env.PORT || 80);
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
  app.set('port', process.env.PORT || 3000);
  app.set('protocol', 'http')
  app.set('hostname', 'localhost');
  app.set('callback', app.get('protocol') + '://' + app.get('hostname') + 
    ':' + app.get('port') + '/auth/twitter/callback');
});

app.configure('production', function(){
  app.use(express.errorHandler());
  app.set('port', process.env.PORT || 80);
  app.set('protocol', 'http')
  app.set('hostname', 'ec2-50-19-161-7.compute-1.amazonaws.com');
  app.set('callback', app.get('protocol') + '://' + app.get('hostname') + 
    ':' + app.get('port') + '/auth/twitter/callback');
});

var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    consumer.key,
    consumer.secret,
    "1.0",
    app.get('callback'),
    "HMAC-SHA1"
);

express.request.oa = express.response.oa = oa;
console.log(app.get('callback'));

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/twitter', user.authenticate);
app.get('/auth/twitter/callback', user.callback);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
