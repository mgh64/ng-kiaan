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
        $or: [{
          type: 'p2p',
          'items.creditor_id': {
            $exists: true
          }
        }, {
          type: 'c2b',
          'creditor_id': {
            $exists: true
          }
        }, {
          type: 'b2c',
          'debtor_id': {
            $exists: true
          }
        }, {
          type: 'b2b',
          'creditor_id': {
            $exists: true
          }
        }, {
          type: 'c2p'
        }, {
          type: 'p2i'
        }]
      }, {
        __v: false
      })
      .sort({
        _id: -1
      })
      .populate({
        path: 'person_id',
        select: 'first_name last_name -_id'
      })
      .populate({
        path: 'items.creditor_id',
        select: 'first_name last_name -_id'
      })
      .populate({
        path: 'debtor_id',
        select: 'number owner -_id'
      })
      .populate({
        path: 'creditor_id',
        select: 'number owner -_id'
      })
      .populate({
        path: 'items.bankacc_id',
        select: 'number owner -_id'
      })
      .populate({
        path: 'creator_id',
        select: 'first_name last_name -_id'
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
