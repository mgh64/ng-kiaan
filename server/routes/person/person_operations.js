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
          $and: [{
            $or: [{
              person_id: mongoose.Types.ObjectId(req.query.person_id)
            }, {
              "items.person_id": mongoose.Types.ObjectId(req.query.person_id)
            }]
          }, {
            type: {
              $ne: 'cheque_ft'
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
            person_id: mongoose.Types.ObjectId(req.query.person_id)
          }, {
            "items.person_id": {
              $ne: mongoose.Types.ObjectId(req.query.person_id)
            }
          }]
        }
      };
      // var sort1 = {
      //   $sort: {
      //     'items._id': -1
      //   }
      // };
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
          price: '$sum',
          items: '$items'
        }
      };
      // var sort2 = {
      //   $sort: {
      //     _id: -1
      //   }
      // };

      var agg = [];
      agg.push(match);
      agg.push(unwind);
      agg.push(match2);
      // agg.push(sort1);
      agg.push(group);
      agg.push(project);
      // agg.push(sort2);
      // console.open(agg);

      var _match = {
        $match: {
          $and: [{
            person_id: mongoose.Types.ObjectId(req.query.person_id)
          }, {
            $or: [{
              type: "receive"
            }, {
              type: "cheque_ft"
            }]
          }]
        }
      }
      var _unwind = {
        $unwind: '$items'
      };
      var _match2 = {
        $match: {
          $and: [{
            "items.type": "cheque"
          }, {
            "items.status": "od"
          }]
        }
      }
      var _project = {
        $project: {
          _id: '$items.od_date',
          // type: '$type',
          id: '$id',
          price: '$items.price',
          items: '$items'
        }
      };

      var _agg = [];
      _agg.push(_match);
      _agg.push(_unwind);
      _agg.push(_match2);
      _agg.push(_project);

      db.operations.aggregate(agg)
        .exec(function(err, result) {
          if (err) {
            throw err
          } else if (result) {
            // console.open(_agg);
            db.operations.aggregate(_agg)
              .exec(function(err, _odat) {
                _odat.forEach(function(r) {
                  result.push(r)
                })
                // console.open(result);
                db.persons.populate(result, {
                  path: 'items.person_id',
                  select: 'first_name last_name id -_id'
                }, function(err, cost) {
                  if (err) throw err;
                  if (cost) {
                    db.costs.populate(cost, {
                      path: 'items.cost_id',
                      select: 'title -_id'
                    }, function(err, income) {
                      if (err) throw err;
                      if (income) {
                        db.incomes.populate(income, {
                          path: 'items.income_id',
                          select: 'title -_id'
                        }, function(err, by) {
                          if (err) throw err;
                          if (by) {
                            db.bys.populate(by, {
                              path: 'by_id',
                              select: 'title'
                            }, function(err, product) {
                              if (err) throw err;
                              if (product) {
                                db.products.populate(product, {
                                  path: 'items.product_id',
                                  select: 'title'
                                }, function(err, _r) {
                                  if (err) throw err;
                                  if (_r) {
                                    // console.open(_r);
                                    _r.forEach(function(r) {
                                      date_to_persian(r._id.getTimestamp(), function(dte) {
                                        r.date = dte.second_less_time + ' - ' + dte.date
                                      });
                                    });

                                    _r.sort(function(a, b) {
                                      return b._id.getTimestamp().getTime() - a._id.getTimestamp().getTime();
                                    });

                                    remaining(mongoose.Types.ObjectId(req.query.person_id), function(err, result) {
                                      if (err) throw err;
                                      if (result && _r.length) {
                                        for (var i = 0; i <= _r.length - 1; i++) {
                                          // console.log(vm.data[i]);
                                          // console.open(remaining.remaining);
                                          _r[i].price = Math.round(_r[i].price);
                                          if (i == 0) {
                                            _r[i].remaining = result.remaining;
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
                                      // console.open(_r);
                                      res.json(_r);
                                    });
                                  }
                                })
                              }
                            });

                            //
                          }
                        })
                      }
                    });
                    //populate
                  }
                })
              })
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
