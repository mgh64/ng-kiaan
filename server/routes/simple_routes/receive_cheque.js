//
//
// by : mostafa

var db = require('db');
var _ = require('lodash');
var date_to_persian = require('functions/date_to_persian');

module.exports = (function() {

  var _return = {};

  _return.get = function(req, res, next) {
    next();
  };

  _return.post = function(req, res, next) {
    if (_.includes(req.user._permissions, "root")) {

      // console.open(req.body);
      var match2 = {
        $match: {
          $and: [{
            "items.type": "cheque"
          }]
        }
      };
      if (req.body.serial) {
        match2.$match.$and.push({
          "items.serial": req.body.serial
        })
      };
      if (!req.body.status) {
        //mojood
        match2.$match.$and.push({
          "items.status": {
            $exists: false
          }
        });
      } else if (req.body.status) {
        if (req.body.status == 'md') {
          //moed daryaft
          match2.$match.$and.push({
            $and: [{
              "items.date": {
                $lte: new Date()
              }
            }, {
              $or: [{
                "items.status": {
                  $exists: false
                }
              }, {
                "items.status": "bg"
              }]
            }]
          });
        } else if (req.body.status == 'ft') {
          match2.$match.$and.push({
            type: "cheque_ft"
          });
        } else if (req.body.status == 'all') {

        } else if (req.body.status == 'pn_action' || req.body.status == 'dj_action' || req.body.status == 'od_action') {

          match2.$match.$and.push({
            $and: [{
              "items.serial": req.body.serial
            }, {
              $or: [{
                  "items.status": {
                    $exists: false
                  }
                },
                {
                  "items.status": 'bg'
                }
              ]
            }]
          });

        } else if (req.body.status == 'ph_action' || req.body.status == 'bg_action' || req.body.status == 'out_action') {

          match2.$match.$and.push({
            $and: [{
              "items.serial": req.body.serial
            }, {
              "items.status": 'dj'
            }]
          });

        } else {
          match2.$match.$and.push({
            "items.status": req.body.status
          });
        }
      }
      // console.open(match2);
      var match = {
        $match: {
          $or: [{
            "type": "cheque_ft"
          }, {
            "type": "receive"
          }]
        }
      };
      var unwind = {
        $unwind: '$items'
      };
      var sort = {
        $sort: {
          _id: -1
        }
      }
      var agg = [];
      agg.push(match);
      agg.push(unwind);
      agg.push(match2);
      agg.push(sort);

      // console.open(agg);

      db.operations.aggregate(
        agg
      ).exec(function(err, result) {
        if (err) {
          throw err
        } else if (result) {
          db.persons.populate(result, {
            path: 'person_id',
            select: 'first_name last_name'
          }, function(err, _res) {
            if (err) throw err;
            if (_res) {
              db.branches.populate(_res, {
                path: 'items.branch_id',
                select: '-__v'
              }, function(err, _r) {
                if (err) throw err;
                if (_r) {
                  db.banks.populate(_r, {
                    path: 'items.branch_id.bank_id',
                    select: '-__v'
                  }, function(err, r) {
                    if (err) throw err;
                    if (r) {
                      r.forEach(function(__r) {
                        date_to_persian(__r.items.date, function(dte) {
                          __r.items.date = dte.date;
                        });
                      })
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
  };


  return _return;
})();
