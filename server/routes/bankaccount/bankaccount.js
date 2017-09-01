//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');

router.post('/bankaccount', function(req, res, next) {
  //
  if (_.includes(req.user._permissions, "root")) {
    if (req.body && req.body._id) {

      // console.log(req.body._id);
      db.operations.find({
        'items.bankacc_id': req.body._id,
        type: 'first_period'
      },{
        __v : false
      })
      .populate({
        path: 'items.bankacc_id',
        select: '-__v'
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
