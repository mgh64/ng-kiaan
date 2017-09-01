//
//
//
var db = require('db');
var path = require('path');
var csv = require('fast-csv');
var fs = require('fs');


var file_path = path.join(__dirname, "bank.csv");
var stream = fs.createReadStream(file_path);

var bank = [];
csv.fromStream(stream, {
    headers: true
  }).on("data", function(data) {
    bank.push(data)
  })
  .on("end", function() {
    db.banks.count(function(err,res){
      if (err){
        console.log(err);
      } else {
        if (res == 0){
          bank.forEach(function(r){
            new db.banks(r).save(function(err) {
              // error with db
              if (err) {
                console.log(err);
              } else {
                // save
                console.log( r.title + ' add to banks collection.');
              }
            });
          })
          // require('../mongo/init_branch');
        }
      }
    })

  })
  .on("error", function(err) {
    if (err) {
      console.log('err2');
    }
  });
