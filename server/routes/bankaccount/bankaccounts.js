//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');
// var ejs = require('ejs');

router.get('/bankaccounts', function(req, res, next) {
  //
  if (_.includes(req.user._permissions, "root")) {

    var match = {
      $match: {
        "items.bankacc_id": {
          $exists: true
        }
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
              type: "cheque_ft"
            }, {
              "items.type": "cheque"
            }]
          }, {
            "items.bankacc_id": {
              $exists: true
            }
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
            "items.bankacc_id": {
              $exists: true
            }
          }]
        }]
      }
    };
    var group = {
      $group: {
        _id: '$items.bankacc_id',
        sum: {
          $sum: '$items.price'
        }
      }
    };
    var project = {
      $project: {
        bankacc_id: '$_id',
        sum: '$sum',
        _id: false
      }
    };
    var sort = {
      $sort: {
        bankacc_id: 1
      }
    }
    var agg = [];
    agg.push(match);
    agg.push(unwind);
    agg.push(match2);
    agg.push(group);
    agg.push(project);
    agg.push(sort);

    // console.open(agg);

    db.operations.aggregate(
      agg
    ).exec(function(err, result) {
      if (err) {
        throw err
      } else if (result) {

        db.bankaccounts.populate(result, {
          path: 'bankacc_id',
          select: '-__v'
        }, function(err, _res) {
          if (err) throw err;
          if (_res) {
            db.branches.populate(_res, {
              path: 'bankacc_id.branch_id',
              select: 'bank_id title id'
            }, function(err, _r) {
              if (err) throw err;
              if (_r) {
                db.banks.populate(_r, {
                  path: 'bankacc_id.branch_id.bank_id',
                  select: 'title'
                }, function(err, r) {
                  if (err) throw err;
                  if (r) {
                    console.open(r);

                    _r.sort(function(a, b) {
                      return a.bankacc_id.id - b.bankacc_id.id;
                    });

                    res.json(r);
                  }
                })
              }
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
