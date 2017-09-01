#!/usr/bin/env node

// Module dependencies.
var app = require('../app');
var debug = require('debug')('kiaan:server');
var http = require('http');
var mongoose = require('mongoose');

connect_mongo();

function http_server() {
   // create HTTP server.
   var server = http.createServer(app);
   addr = server.address();
   // Listen on provided port, on all network interfaces.
   server.listen(port);
   server.on('error', onError);
   server.on('listening', onListening);

   // Event listener for HTTP server "error" event.
   function onError(error) {
      if (error.syscall !== 'listen') {
         throw error;
      }

      var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
         case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
         case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
         default:
            throw error;
      }
   }

   // Event listener for HTTP server "listening" event.
   function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
      debug('Listening on ' + bind);
      if (global.init.server_init_log)
         console.log("webserver start listening on port -> " + port);
   }
}

// connecting to mongo server
function connect_mongo() {

   //   var options = { promiseLibrary: require('bluebird') };
   mongoose.Promise = global.Promise;
   mongoose.connect(global.init.db_url);

   var db = mongoose.connection;

   db.on('error', function(err) {
      console.log('Error : Mongodb ' + err);
   });

   db.once('open', function() {

      // if server connet to mongoDB successfully, then burn
      // the HTTP server
      http_server();
      if (global.init.server_init_log) {
         console.log("connected to mongoDB(" + db.name + ") successfully.");
      }

   });

   // var b = mongoose.createConnection("mongodb://localhost/pooyaaaa");
   //
   // var Schema = mongoose.Schema;
   // var ObjectId = Schema.Types.ObjectId;
   //
   // var files_schema = Schema({
   //     owner: {
   //         type: ObjectId,
   //         ref: 'users'
   //     },
   //     temp: Boolean,
   //     extension: String,
   //     full_name: String,
   //     size: Number,
   //     public: Boolean
   // });
   //
   // var ff =  b.model('files', files_schema);
   //
   // new ff({ size : 2 }).save();
   //
   // var b2 = mongoose.createConnection("mongodb://localhost/pooyaaaaaaaaaa");
   //
   // var Schema = mongoose.Schema;
   // var ObjectId = Schema.Types.ObjectId;
   //
   // var fff =  b2.model('filess', files_schema);
   //
   // new fff({ size : 2 }).save();
}

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || global.init.port || '3000');
app.set('port', port);


// Normalize a port into a number, string, or false.
function normalizePort(val) {
   var port = parseInt(val, 10);

   if (isNaN(port)) {
      // named pipe
      return val;
   }

   if (port >= 0) {
      // port number
      return port;
   }

   return false;
}
