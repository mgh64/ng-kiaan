//
// by : mostafa
//

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

      var match = {
        $match: {
          $and: [{
              "type": "receive"
            },
            {
              "items.type": "cheque"
            }
          ]
        }
      };
      var unwind = {
        $unwind: '$items'
      };
      var match2 = {
        $match: {
          $and: [{
              "items.type": "cheque"
            },
            {
              $or: [{
                  "items.status.value": "dj"
                },
                {
                  "items.status.value": "ph"
                }
              ]
            }
          ]
        }
      };
      // var sort = {
      //   $sort: {
      //     "items.status.id": 1,
      //     "items.status._id": 1
      //   }
      // };
      var group = {
        $group: {
          _id: '$items.status.id',
          first_item: {
            $first: "$items"
          },
          //             items: {
          //               $addToSet: "$items"
          //             },
          count: {
            $sum: 1
          },
          sum: {
            $sum: '$items.price'
          }
        }
      };
      var project = {
        $project: {
          _id: "$first_item.status._id",
          id: '$_id',
          first_item: "$first_item.serial",
          bankacc_id: "$first_item.status.bankacc_id",
          //             items: "$items",
          count: "$count",
          sum: "$sum"
        }
      };
      var sort2 = {
        $sort: {
          id: 1
        }
      };
      var aggregate = [];
      aggregate.push(match);
      aggregate.push(unwind);
      aggregate.push(match2);
      // aggregate.push(sort);
      aggregate.push(group);
      aggregate.push(project);
      // aggregate.push(sort2);

      db.operations.aggregate(
        aggregate
      ).exec(function(err, result) {
        if (err) {
          throw err
        } else if (result) {
          db.bankaccounts.populate(result, {
            path: 'bankacc_id',
            select: 'id number -_id'
          }, function(err, _r) {
            //
            _r.forEach(function(r) {
              date_to_persian(r._id.getTimestamp(), function(dte) {
                r.date = dte.second_less_time + ' - ' + dte.date
              });
            });
            res.json(_r);
            //
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
