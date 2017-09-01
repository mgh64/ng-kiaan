//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');

router.get('/bank', function(req, res, next) {
  //
  // console.log(req.query._id);
  if (_.includes(req.user._permissions, "root")) {
    if (req.query._id) {

      db.banks.find({
        '_id': req.query._id
      },{
        __v : false
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
  //
})

module.exports = router;
