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
const remaining = require('functions/cash/remaining');


router.get('/cash_operations', function(req, res, next) {
  if (_.includes(req.user._permissions, "root")) {

    if (req.query) {

      var unwind = {
        $unwind: '$items'
      };
      var match = {
        $match: {
          $or: [{
            "items.type": "cash"
          }, {
            "items.status": "pn"
          }]
        }
      };
      var project = {
        $project: {
          _id: {
            $cond: {
              if: {
                $eq: ['$items.type', 'cash']
              },
              then: '$_id',
              else: '$items.pn_date'
            }
          },
          person_id: '$person_id',
          cost_id: '$cost_id',
          income_id: '$income_id',
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
      };

      var agg = [];
      agg.push(unwind);
      agg.push(match);
      agg.push(project);
      agg.push(sort);

      db.operations.aggregate(agg)
        .exec(function(err, r) {
          if (err) {
            throw err
          } else if (r) {
            db.persons.populate(r, {
              path: 'person_id',
              select: 'first_name last_name -_id'
            }, function(err, p) {
              if (err) throw err;
              if (p) {
                db.costs.populate(p, {
                  path: 'cost_id',
                  select: 'title -_id'
                }, function(err, c) {
                  if (err) throw err;
                  if (c) {
                    db.incomes.populate(c, {
                      path: 'income_id',
                      select: 'title -_id'
                    }, function(err, _r) {
                      if (err) throw err;
                      if (_r) {
                        _r.forEach(function(r) {
                          date_to_persian(r._id.getTimestamp(), function(dte) {
                            r.date = dte.second_less_time + ' - ' + dte.date
                          });
                        });
                        remaining(function(err, result) {
                          if (err) throw err;
                          if (result && _r.length) {
                            for (var i = 0; i <= _r.length - 1; i++) {
                              if (i == 0) {
                                // console.open(result.sum);
                                // console.open(_r[i]);
                                _r[i].remaining = result;
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
                    })
                  }
                })
              }

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
