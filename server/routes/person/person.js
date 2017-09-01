//
//
// by : mostafa
"use strict";

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');

router.post('/person', function(req, res, next) {

  if (_.includes(req.user._permissions, "root")) {
    if (req.body && req.body._id) {

      // console.log(req.body._id);
      db.operations.find({
        person_id: req.body._id,
        type: 'first_period'
        // db.persons.findOne({
        //   _id: req.body._id
      })
      .populate({
        path: 'person_id',
        select: '-__v'
      }).lean().exec(function(err, result) {
        if (err) throw err
        else if (result) {
          if (!result[0].person_id.gender) {
            result[0].person_id.gender = false;
          };
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
