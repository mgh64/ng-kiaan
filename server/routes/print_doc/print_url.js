//
//
// by mostafa

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db = require('db');
var ejs = require('ejs');

router.get('/_url', function(req, res, next) {
  // console.log('sd');
  res.send(
    ejs.render(
      `<html style="">
      <head>
      <link type="text/css" rel="stylesheet" href="dist/css/myfonts.css">
      </head>
      <body dir="rtl" style="width:207mm;height: 144mm;">
      <h1 style="background-color: coral;font-family: b_yekan;margin: 2mm;"><%= first_name %></h1>
      <h3 style="background-color: lightgray;font-family: b_yekan; margin-top: 64mm; margin-right: 5mm; width: 30mm; height: 7mm">
        <%= last_name %>
      </h3>
      </body>
      </html>`, {
        first_name: 'مصطفی',
        last_name: '1,000,000,000'
      })
  );
})

module.exports = router;
