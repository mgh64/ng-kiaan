//
//
// by : mostafa

var date_to_persian = require('functions/date_to_persian');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db = require('db');

router.get('/payments', function(req, res, next) {
  //
  if ((req.query.from) && (req.query.to) && (_.includes(req.user._permissions, "root"))) {
    //
    var _from = req.query.from;
    var _to = req.query.to;

    var match = {
      $match: {
        type: 'payment'
      }
    };
    var unwind = {
      $unwind: '$items'
    };
    var group = {
      $group: {
        _id: {
          _id: '$_id',
          id: '$id',
          person_id: '$person_id',
          cost_id: '$cost_id',
          by_id: '$by_id',
          comment: '$comment'
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
        total: {
          $sum: '$items.price'
        }
      }
    };
    var project = {
      $project: {
        _id: '$_id._id',
        id: '$_id.id',
        person_id: '$_id.person_id',
        cost_id: '$_id.cost_id',
        by_id: '$_id.by_id',
        comment: '$_id.comment',
        cash_count: '$cash_count',
        cheque_count: '$cheque_count',
        bank_count: '$bank_count',
        total: '$total'
      }
    };
    var sort = {
      $sort: {
        _id: -1
      }
    };
    // var skip = {
    //   $skip: _from
    // };
    // var limit = {
    //   $limit: _to - _from
    // }
    //
    var agg = [];
    agg.push(match);
    agg.push(unwind);
    agg.push(group);
    agg.push(project);
    agg.push(sort);
    // }, {
    //   $skip: _from
    // }, {
    //   $limit: _to - _from

    db.operations.aggregate(agg).exec(function(err, result) {
      if (err) {
        throw err
      } else if (result) {
        var count = result.length;
        result = result.slice(_from, _to);
        db.persons.populate(result, {
          path: 'person_id',
          select: 'first_name last_name id -_id'
        }, function(err, popPerson_id) {
          if (err) throw err;
          if (popPerson_id) {
            db.costs.populate(popPerson_id, {
              path: 'cost_id',
              select: 'title id -_id'
            }, function(err, popCost_id) {
              if (err) throw err;
              if (popCost_id) {
                db.bys.populate(popCost_id, {
                  path: 'by_id',
                  select: 'title'
                }, function(err, _r) {
                  if (err) throw err;
                  if (_r) {
                    _r.forEach(function(r) {
                      date_to_persian(r._id.getTimestamp(), function(dte) {
                        r.date = dte.second_less_time + ' - ' + dte.date
                      });
                    });
                    res.json({
                      data: _r,
                      count: count
                    });
                  }
                })
              }
            })
          }
        })
      }
    });
  } else {
    next({
      status: 403
    });
  }
  //
})

module.exports = router;
