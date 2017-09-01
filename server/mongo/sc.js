var fs = require('fs');
var path = require('path');

var end = true;
var log = "var mongoose = require('mongoose');" + '\n'

if (end == true){
  fs.appendFile(path.join(__dirname, "../schema.js"), log, function(err) {
    if (err) return console.log(err);
  });
  end = false;
}
