//
//
//by : mostafa
"use strict";

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');
var remaining = require('functions/person/remaining');

router.get('/person_info', function(req, res, next) {
  //
  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
    var person_id = req.query.person_id;
    // console.open(person_id);
    remaining(person_id, function(err, remaining){
      res.json(remaining);
    });
  }
  //
});

module.exports = router;
