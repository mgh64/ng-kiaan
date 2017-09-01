//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');
const remaining = require('functions/cash/remaining');

router.get('/cash', function(req, res, next) {
  //
  if (_.includes(req.user._permissions, "root")) {

    remaining(function(err, result) {
      if (err) throw err;
      if (result) {
        res.json({
          remaining: result
        })
      }
    })

  } else {
    next({
      status: 403
    });
  }

})

module.exports = router;
