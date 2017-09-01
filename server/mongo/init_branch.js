//
//
//
var db = require('db');
var path = require('path');
var csv = require('fast-csv');
var fs = require('fs');

var file_path = path.join(__dirname, "branch.csv");
var stream = fs.createReadStream(file_path);

var branches = [];
csv.fromStream(stream, {
    headers: true
  }).on("data", function(data) {
    branches.push(data)
  })
  .on("end", function() {
    db.banks.find({}, {
      title: 1
    }).sort({
      _id: 1
    }).lean().exec(function(err, res) {
      // console.log(res.length);
      if (err) {
        console.log(err);
      } else if (res.length > 0) {
        var objBank = {};
        res.forEach(function(r) {
          objBank[r.title] = r._id;
        });
        // console.open(objBank);
        var ctr = 1;
        branches.forEach(function(r) {
          r.bank_id = objBank[r.bank];
          delete r.bank;
          new db.branches(r).save(function(err, res) {
            if (err) {
              console.log(err);
            } else if (res) {
              console.log(ctr + " =>" + res.title + " branch add to branches collection.");
              ctr += 1;
            }
          })
        })

      }
    });

    // branches.forEach(function(r){
    //   db.banks.update({
    //     name: r.bank
    //   }, {
    //     $push: { branches: {id :r.id, name:r.name} }
    //   }, function(err, res) {
    //     if (err) {
    //       console.log(err);
    //     } else if (res) {
    //       console.dir(res);
    //     }
    //   });



  })
  .on("error", function(err) {
    if (err) {
      console.log('err2');
    }
  });
