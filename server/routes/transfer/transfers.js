//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');
var date_to_persian = require('functions/date_to_persian');

router.get('/transfers', function(req, res, next) {
  if (_.includes(req.user._permissions, "root")) {
    //
    db.operations.find({
        type: {
          $in: ['p2p', 'c2b', 'b2c', 'b2b', 'c2p', 'p2i']
        }
      }, {
        __v: false
      })
      .sort({
        _id: -1
      })
      .populate({
        path: 'items.person_id',
        select: 'first_name last_name -_id'
      })
      .populate({ //cash
        path: 'creator_id',
        select: 'first_name last_name -_id'
      })
      .populate({
        path: 'items.bankacc_id',
        select: 'number owner -_id'
      })
      .populate({
        path: 'items.cost_id',
        select: 'title -_id'
      })
      .populate({
        path: 'items.income_id',
        select: 'title -_id'
      })
      .lean()
      .exec(function(err, r) {
        if (err) throw err;
        if (r) {
          r.forEach(function(_res) {
            date_to_persian(_res._id.getTimestamp(), function(dte) {
              _res.date = dte.second_less_time + ' - ' + dte.date;
            });
          });
          res.json(r);
        }
      });

  } else {
    next({
      status: 403
    });
  }
})

module.exports = router;
