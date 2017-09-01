//
//
// by : mostafa
"use strict";

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');

router.get('/persons_info', function(req, res, next) {

  if (_.includes(req.user._permissions, "root")) {
    //
    var match = {
      $match: {
        $or: [{
          person_id: {
            $exists: true
          }
        }, {
          "items.person_id": {
            $exists: true
          }
        }]
      }
    };
    var unwind = {
      $unwind: '$items'
    };
    var match2 = {
      $match: {
        $or: [{
          $and: [{
            type: {
              $ne: "cheque_ft"
            }
          }, {
            "items.status": {
              $ne: "od"
            }
          }]
        }, {
          $and: [{
            type: "cheque_ft"
          }, {
            "items.status": "od"
          }]
        }]
      }
    }
    var group = {
      $group: {
        _id: {
          person_id: {
            $ifNull: ['$person_id', '$items.person_id']
          }
        },
        sum: {
          $sum: {
            $cond: {
              if: {
                $ne: ["$type", "cheque_ft"]
              },
              then: {
                $multiply: [{
                  $ifNull: ['$items.value', 1]
                }, '$items.price']
              },
              else: {
                $subtract: [
                  0,
                  '$items.price'
                ]
              }
            }
          }
        }
      }
    };    var project = {
      $project: {
        _id: false,
        person_id: '$_id.person_id',
        // sum: '$sum'
        sum: {
          $subtract: [
            0,
            '$sum'
          ]
        }
      }
    };
    var sort = {
      $sort: {
        person_id: 1
      }
    }
    var aggregate = [];
    aggregate.push(match);
    aggregate.push(unwind);
    aggregate.push(match);  //for transfer
    aggregate.push(match2);
    aggregate.push(group);
    aggregate.push(project);
    aggregate.push(sort);

    db.operations.aggregate(
      aggregate
    ).exec(function(err, result) {
      if (err) console.log(err);
      if (result) {
        db.persons.populate(result, {
          path: 'person_id',
          select: 'first_name last_name id credit_limit'
        }, function(err, info) {
          if (err) throw err;
          if (info) {
            info.forEach(function(r){
              r.sum = Math.round(r.sum);
            })
            // console.open(info);
            res.json(info);
          }
        })
      }
    });

  } else {
    next({
      status: 403
    });
  }

})

module.exports = router;
