//
//
// by : mostafa
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db = require('db');
var date_to_persian = require('functions/date_to_persian');

router.get('/receive', function(req, res, next) {
  //
  if (_.includes(req.user._permissions, "root")) {
    if (req.query && req.query._id) {
      db.operations.findOne({
        _id: req.query._id
      }).lean().exec(function(err, result) {
        if (err) throw err
        else if (result) {
          result.items.forEach(function(r) {
            if (r.income_id) {
              r.price = -Math.abs(r.price)
            } else {
              r.price = Math.abs(r.price)
            }
            if (r.date) {
              date_to_persian(r.date, function(res) {
                r.date = res.date;
              })
            }
          })
          res.json(result);
        }
      });

    }
  } else {
    next({
      status: 403
    });
  }
  //
})

module.exports = router;
