//
//
// by : mostafa
"use strict";

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');

router.get('/transfer', function(req, res, next) {

  // console.log(req.query._id);
  if (_.includes(req.user._permissions, "root")) {
    if (req.query && req.query._id) {

      db.operations.find({
        _id: req.query._id
      }).lean().exec(function(err, result) {
        if (err) throw err
        else if (result) {
          // console.open(result);
          res.json(result);
        }
      });

    }
  } else {
    next({
      status: 403
    });
  }

})

module.exports = router;
