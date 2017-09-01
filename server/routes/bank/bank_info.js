//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');

router.get('/bank_info', function(req, res, next) {
  if (_.includes(req.user._permissions, "root")) {
    //
    db.banks.find({}, {
      __v: false
    }).sort({_id : -1}).lean().exec(function(err, banks) {
      if (err) {
        next({
          status: 500,
          error_obj: err
        })
      } else {
        res.json(banks);
      }
    })

  } else {
    next({
      status: 403
    });
  }
})

module.exports = router;
