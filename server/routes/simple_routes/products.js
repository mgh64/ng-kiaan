//
//
// by : mostafa

var db = require('db');
var _ = require('lodash');
var date_to_persian = require('functions/date_to_persian');

module.exports = (function() {

  var _return = {};

  _return.post = function(req, res, next) {
    next();
  };

  _return.get = function(req, res, next) {
    if (_.includes(req.user._permissions, "root")) {

      var unwind = {
        $unwind: '$items'
      };
      var match = {
        $match: {
          "items.product_id": {
            $exists: true
          }
        }
      };
      var group = {
        $group: {
          _id: '$items.product_id',
          sum: {
            $sum: '$items.value'
          }
        }
      };
      var project = {
        $project: {
          product_id: '$_id',
          sum: '$sum',
          _id: false
        }
      };
      var sort = {
        $sort: {
          product_id: 1
        }
      }
      var agg = [];
      agg.push(unwind);
      agg.push(match);
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
          db.products.populate(result, {
            path: 'product_id',
            select: '-__v'
          }, function(err, _res) {
            if (err) throw err;
            if (_res) {
              db.g_products.populate(_res, {
                path: 'product_id.group_id',
                select: '-__v'
              }, function(err, _r) {
                if (err) throw err;
                if (_r) {
                  db.units.populate(_r, {
                    path: 'product_id.unit_id',
                    select: '-__v'
                  }, function(err, r) {
                    if (err) throw err;
                    if (r) {
                      // console.open(r);
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
