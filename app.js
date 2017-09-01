//
//this project created by mostafa ghasemi
//95/05/22
//
global.init = require('./config.json');
global.init.version = require('./package.json').version;
global.init.name = require('./package.json').name;
//
// main web server and router module
var express = require('express');
// core nodejs module for working with directory names
var path = require('path');
// just add favicon to project
var favicon = require('serve-favicon');
// log every request come to server with detail, it's good
// for debuging
var logger = require('morgan');
// and some cookie and session modules
var cookieParser = require('cookie-parser');
// parse json data to standarad form
var bodyParser = require('body-parser');


// if using cookie
cookie = require('cookie-session');

compression = require('compression');
// if using redis
session = require('express-session');
redisStore = require('connect-redis')(session);

var redis = require('redis');
var client = redis.createClient();
client.on("error", function(err) {
  console.log("redis Error -> " + err);
});

client.on("connect", function(err) {
  if (global.init.server_init_log)
    console.log("connected to redis successfully.");
});

var app = express();


// TODO favicon
// uncomment after placing favicon in /public
//app.use(favicon(path.join(__dirname, 'client/public', 'favicon.ico')));

// don't show the express behind the
app.disable('x-powered-by');
// gzip all requests :) it's very usefull, but don't
// work on very old browsers...
app.use(compression());

app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// set public dir path
app.use(express.static(path.join(__dirname, 'client/public')));

// parsing income data to standarad JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// this is session secret and if change every sessions fail
// and every one need new login!
//
// warning : this is a secret value and sould
// change in server.
//
app.use(cookieParser(',mvnsdvslk6571:KJHDE'));

// view path config for ejs engine is here
app.set('views', path.join(__dirname, './client/views'));

// this is my server side view engine, but I use it
// only for little main renders and other renders
// are in client side.
app.set('view engine', 'ejs');

// redis middleware part

if (global.init.session_secret) {
  app.use(session({
    secret: global.init.session_secret,
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: client
    }),
    name: 'secret',
    saveUninitialized: false, // don't create session until something stored,
    resave: false // don't save session if unmodified
  }));
};

require('./server/node_modules/my_utils');
// add my own modules
require('./server/utils/requires');
//
// app.get('/test', function(req,res){
//   console.dir(req.query);
//   res.json(req.query)
// })
// load routers
require('./server/routes/_root')(app);
module.exports = app;
