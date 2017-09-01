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
const remaining = require('functions/person/remaining');


router.get('/person_operations', function(req, res, next) {
  if (_.includes(req.user._permissions, "root")) {

    if (req.query && req.query.person_id) {

      // console.log(req.query.person_id);
      var match = {
        $match: {
          $or: [{
            person_id: mongoose.Types.ObjectId(req.query.person_id)
          }, {
            "items.person_id": mongoose.Types.ObjectId(req.query.person_id)
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
              $or: [{
                person_id: mongoose.Types.ObjectId(req.query.person_id)
              }, {
                "items.person_id": {
                  $ne: mongoose.Types.ObjectId(req.query.person_id)
                }
              }]
            }, {
              type: {
                $ne: 'cheque_ft'
              }
            }]
          }, {
            $and: [{
              'items.type': 'cheque'
            }, {
              'items.status': 'od'
            }]
            // $and: [{
            //   $or: [{
            //     type: "cheque_ft"
            //   }, {
            //     "items.type": "cheque"
            //     // type: "receive"
            //   }]
            // }, {
            //   "items.status": "od"
            // }]
          }]
        }
      };
      var group = {
        $group: {
          _id: {
            _id: '$_id',
            id: '$id',
            type: '$type',
            by_id: '$by_id',
            comment: '$comment'
          },
          // first_items : {
          //                 $first : '$items'
          //             },
          items: {
            $addToSet: "$items"
          },
          cash_count: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$items.type', 'cash']
                },
                then: 1,
                else: 0
              }
            }
          },
          cheque_count: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$items.type', 'cheque']
                },
                then: 1,
                else: 0
              }
            }
          },
          bank_count: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$items.type', 'bank']
                },
                then: 1,
                else: 0
              }
            }
          },
          inv_itm_count: {
            $sum: {
              $cond: {
                if: {
                  $gt: ['$items.product_id', 0]
                },
                then: 1,
                else: 0
              }
            }
          },
          sum: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$type', 'p2p']
                  // $or: [{
                  //   $eq: ['$type', 'p2i']
                  // }, {
                  //   $eq: ['$type', 'c2p']
                  // }]
                },
                then: {
                  $multiply: [{
                    $ifNull: ['$items.value', 1]
                  }, '$items.price']
                },
                else: {
                  $subtract: [
                    0,
                    {
                      $multiply: [{
                        $ifNull: ['$items.value', 1]
                      }, '$items.price']
                    }
                  ]

                }
              }
            }
          }
        }
      };
      var project = {
        $project: {
          _id: '$_id._id',
          type: '$_id.type',
          id: '$_id.id',
          by_id: '$_id.by_id',
          comment: '$_id.comment',
          inv_itm_count: '$inv_itm_count',
          cash_count: '$cash_count',
          cheque_count: '$cheque_count',
          bank_count: '$bank_count',
          // price: {
          //   $cond: {
          //     if: {
          //       $or: [{
          //         $eq: ['$_id.type', 'p2p']
          //       }, {
          //         $eq: ['$items.type', 'cheque']
          //         // $and: [{
          //         // }, {
          //         //   $or: [{
          //         //     $eq: ['$_id.type', 'cheque_ft']
          //         //   }, {
          //         //     $eq: ['$items.type', 'cheque']
          //         //   }]
          //         // }]
          //       }]
          //     },
          //     then: {
          //       $subtract: [
          //         0,
          //         '$sum'
          //       ]
          //     },
          //     else: '$sum'
          //   }
          // },
          price: '$sum',
          items: '$items'
        }
      };
      var sort = {
        $sort: {
          _id: -1
        }
      };

      var agg = [];
      agg.push(match);
      agg.push(unwind);
      agg.push(match2);
      agg.push(group);
      agg.push(project);
      agg.push(sort);

      var _group = {
        $group: {
          _id: null,
          count: {
            $sum: 1
          }
        }
      }
      var _agg = [];
      _agg.push(match);
      _agg.push(unwind);
      _agg.push(match2);
      _agg.push(group);
      _agg.push(_group);

      db.operations.aggregate(_agg)
        .exec(function(err, result) {
          if (err) {
            throw err
          } else if (result && result[0].count) {
            // console.open(result[0].count);
            //
            db.operations.aggregate(agg)
              .exec(function(err, _result) {
                db.persons.populate(_result, {
                  path: 'items.person_id',
                  select: 'first_name last_name id -_id'
                }, function(err, person) {
                  if (err) throw err;
                  if (person) {
                    db.costs.populate(person, {
                      path: 'items.cost_id',
                      select: 'title -_id'
                    }, function(err, cost) {
                      if (err) throw err;
                      if (cost) {
                        db.incomes.populate(cost, {
                          path: 'items.income_id',
                          select: 'title -_id'
                        }, function(err, income) {
                          if (err) throw err;
                          if (income) {
                            db.bys.populate(income, {
                              path: 'by_id',
                              select: 'title -_id'
                            }, function(err, by) {
                              if (err) throw err;
                              if (by) {
                                db.products.populate(by, {
                                  path: 'items.product_id',
                                  select: 'title -_id'
                                }, function(err, _r) {
                                  if (err) throw err;
                                  if (_r) {
                                    _r.forEach(function(r) {
                                      date_to_persian(r._id.getTimestamp(), function(dte) {
                                        r.date = dte.second_less_time + ' - ' + dte.date
                                      });
                                    })
                                    remaining(mongoose.Types.ObjectId(req.query.person_id), function(err, _res) {
                                      if (err) throw err;
                                      if (_res && _r.length) {

                                        for (var i = 0; i <= _r.length - 1; i++) {
                                          // console.log(vm.data[i]);
                                          // console.open(remaining.remaining);
                                          if (i == 0) {
                                            _r[i].remaining = _res.remaining;
                                          } else if (i == _r.length - 1) {
                                            if (_r[i].price == 0) {
                                              _r[i].remaining = 0;
                                            } else {
                                              _r[i].remaining = _r[i - 1].remaining - _r[i - 1].price;
                                            }
                                          } else {
                                            _r[i].remaining = _r[i - 1].remaining - _r[i - 1].price;
                                          }
                                          if (_r[i].remaining > 0) {
                                            _r[i].mahiat = 'بدهکار';
                                          } else if (_r[i].remaining < 0) {
                                            _r[i].mahiat = 'بستانکار';
                                          } else {
                                            _r[i].mahiat = 'بی حساب';
                                          }
                                        }
                                      }
                                      res.json(_r)
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              })
          }
        })
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
