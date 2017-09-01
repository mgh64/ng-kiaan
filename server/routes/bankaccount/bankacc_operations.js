//
//
// by : mostafa
"use strict";

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const db = require('db');
const _ = require('lodash');
const date_to_persian = require('functions/date_to_persian');
const remaining = require('functions/bankaccount/remaining');


router.get('/bankacc_operations', function(req, res, next) {
  if (_.includes(req.user._permissions, "root")) {

    if (req.query && req.query.bankacc_id) {

      // console.log(req.query.bankacc_id);
      var match = {
        $match: {
          "items.bankacc_id": mongoose.Types.ObjectId(req.query.bankacc_id)
        }
      };
      var unwind = {
        $unwind: '$items'
      };
      var match2 = {
        $match: {
          $or: [{
            $and: [{
              $or: [{
                type: "cheque_ft" //first period
              }, {
                "items.type": "cheque" //cheque of receive
              }]
            }, {
              "items.bankacc_id": mongoose.Types.ObjectId(req.query.bankacc_id)
            }, {
              "items.status": "ph"
            }]
          }, {
            $and: [{
              $and: [{
                type: {
                  $ne: "cheque_ft"
                }
              }, {
                "items.type": {
                  $ne: "cheque"
                }
              }]
            }, {
              "items.bankacc_id": mongoose.Types.ObjectId(req.query.bankacc_id)
            }]
          }]
        }
      };
      var match3 = {
        $match: {
          $or: [{
            $and: [{
              $or: [{
                type: "cheque_ft" //first period
              }, {
                "items.type": "cheque" //cheque of receive
              }]
            }, {
              "items.bankacc_id": mongoose.Types.ObjectId(req.query.bankacc_id)
            }, {
              "items.status": "ph"
            }]
          }, {
            $and: [{
              $and: [{
                type: {
                  $ne: "cheque_ft"
                }
              }, {
                "items.type": {
                  $ne: "cheque"
                }
              }]
            }, {
              "items.bankacc_id": mongoose.Types.ObjectId(req.query.bankacc_id)
            }]
          }]
        }
      };
      var project = {
        $project: {
          _id: {
            $cond: {
              if: {
                $or: [{
                  $eq: ["$type", "cheque_ft"]
                }, {
                  $eq: ["$items.type", "cheque"]
                }]
              },
              then: "$items.ph_date",
              else: "$_id"
            }
          },
          type: '$type',
          id: '$id',
          price: '$items.price',
          items: '$items'
        }
      };
      var sort = {
        $sort: {
          _id: -1
        }
      }
      var agg = [];
      agg.push(match);
      agg.push(unwind);
      agg.push(match3);
      agg.push(project);
      agg.push(sort);

      db.operations.aggregate(agg)
        .exec(function(err, _r) {
          if (err) {
            throw err
          } else if (_r) {
            _r.forEach(function(r) {
              date_to_persian(r._id.getTimestamp(), function(dte) {
                r.date = dte.second_less_time + ' - ' + dte.date
              });
              // if (r._id instanceof Date) {
              //   date_to_persian(r._id, function(dte) {
              //     r.date = dte.second_less_time + ' - ' + dte.date
              //   });
              // } else {
              // }
            });
            //
            // _r.sort(function(a, b) {
            //   return b._id > a._id
            // });
            remaining(mongoose.Types.ObjectId(req.query.bankacc_id), function(err, result) {
              if (err) throw err;
              if (result && _r.length) {
                for (var i = 0; i <= _r.length - 1; i++) {
                  if (i == 0) {
                    // console.open(result.remaining);
                    // console.open(_r[i]);
                    _r[i].remaining = result.remaining;
                  } else if (i == _r.length - 1) {
                    if (_r[i].items.price == 0) {
                      _r[i].remaining = 0;
                    } else {
                      _r[i].remaining = _r[i - 1].remaining - _r[i - 1].items.price;
                    }
                  } else {
                    _r[i].remaining = _r[i - 1].remaining - _r[i - 1].items.price;
                  }
                }
              }
              res.json(_r);
            });
          }
        });
      //
    } else {
      next({
        status: 403
      });

    }

  } else {
    next({
      status: 403
    });
  }
})

module.exports = router;
