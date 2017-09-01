//
//
//
// by : mostafa
"use strict";

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');
var date_to_persian = require('functions/date_to_persian');

router.post('/persons', function(req, res, next) {

  if (_.includes(req.user._permissions, "root")) {

    var _from = req.body.from
    var _to = req.body.to
    // var _query;
    // _query.qs = "قاسمی";
    // _query.$or = [{
    //   first_name: new RegExp(_query)
    // }, {
    //   last_name: new RegExp(_query)
    // }];
    // console.log(_query);
    // console.dir(req.body._to);

    // console.log(_from);
    // console.log(_to);
    // var _from = Math.abs(req.body._from),
    //   _to = Math.abs(req.body._to);
    //
    // if (_from > _to) _to = [_from, _from = _to][0];
    // var match = {
    //   $match : {
    //     person_id:
    //   }
    // }
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
        $and: [{
          $or: [{
            person_id: {
              $exists: true
            }
          }, {
            "items.person_id": {
              $exists: true
            }
          }]

        }, {
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
        first_period: {
          $first: "$items"
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
    };
    var project = {
      $project: {
        _id: false,
        person_id: '$_id.person_id',
        first_period: '$first_period',
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
        person_id: -1
      }
    };
    // var skip = {
    //   $skip: _from
    // }
    // var limit = {
    //   $limit: _to - _from
    // }
    var agg = [];

    agg.push(match);
    agg.push(unwind);
    agg.push(match2);
    agg.push(group);
    agg.push(project);
    agg.push(sort);
    // agg.push(skip);
    // agg.push(limit);

    // console.open(agg);
    db.operations.aggregate(
      agg
      //   $skip: _from
      //   $limit: _to - _from
    ).exec(function(err, result) {
      if (err) {
        throw err
      } else if (result) {
        var sumAll = 0;
        result.forEach(function(_r) {
          sumAll += _r.sum;
        });
        var _r = result.slice(_from, _to);
        db.persons.populate(_r, {
          path: 'person_id',
          select: '-__v'
        }, function(err, person) {
          if (err) throw err;
          if (person) {
            db.g_persons.populate(person, {
              path: 'person_id.group_id',
              select: '-__v'
            }, function(err, _res) {
              _res.forEach(function(r) {
                if (r.person_id.address && r.person_id.address != null) {
                  r.person_id.details.push({
                    number: r.person_id.address,
                    type: 'address'
                  });
                }
                if (r.person_id.credit_limit && r.person_id.credit_limit != null) {
                  r.person_id.details.push({
                    number: r.person_id.credit_limit,
                    type: 'credit_limit'
                  });
                }
                date_to_persian(r.person_id._id.getTimestamp(), function(dte) {
                  r.person_id.details.push({
                    number: dte.second_less_time + ' - ' + dte.date,
                    type: 'create_date'
                  });
                });
                r.sum = Math.round(r.sum);
              });

              // console.open(_res);
              res.json({
                data: _res,
                sum: Math.round(sumAll),
                count: result.length
              });

            });
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
// details: {
//   credit_limit: {
//     $ifNull: ["$credit_limit", "آزاد"]
//   },
//   address: {
//     $ifNull: ["$address", "-"]
//   },
//   comment: {
//     $ifNull: ["$comment", "-"]
//   },
//   phone: {
//     $ifNull: ["$phone", []]
//   },
//   bank_acc: {
//     $ifNull: ["$bank_acc", []]
//   }
// }

///aggregate :
// name: {
//   $concat: ["$last_name", {
//     $ifNull: [{
//       $concat: [" - ", "$first_name"]
//     }, ""]
//   }]
// },
