//
//
// by : mostafa

var express = require('express');
var router = express.Router();

var phantom = require('phantom');
var path = require('path');
var db = require('db');
var _ = require('lodash');
var fs = require('fs');

router.get('/new_ft', function(req, res, next) {
  // console.dir(req);

  phantom.create().then(function(ph) {
    ph.createPage().then(function(page) {
      var url = "http://localhost:3000/_url" //+ "/abcd";
      page.open(url).then(function(status) {

        var file_name = path.join(__dirname, '../../../reports/', 'report_' + '123.pdf');

        page.render(file_name).then(function() {

          // res.download(file_name);

          var from = fs.createReadStream(file_name);

          from.pipe(res);
          from.on('end', function() {
            ph.exit();
          });

        });
      });

    })
  })
  // console.open({
  //   sss: "s"
  // });
  // res.json({});
})

module.exports = router;
