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

      var _from = req.body.from;
      var _to = req.body.to;

      var match = {
        $match: {
          $or: [{
            type: 'buy'
          }, {
            type: 'sale'
          }]
        }
      };
      var unwind = {
        $unwind: '$items'
      };
      var group = {
        $group: {
          _id: {
            type: '$type',
            _id: '$_id',
            id: '$id',
            person_id: '$person_id',
            by_id: '$by_id',
            comment: '$comment'
          },
          first_items: {
            $first: "$items"
          },
          count: {
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
          total: {
            $sum: {
              $multiply: [{
                $ifNull: ['$items.value', 1]
              }, '$items.price']
            }
          }
        }
      };
      var project = {
        $project: {
          type: '$_id.type',
          _id: '$_id._id',
          id: '$_id.id',
          person_id: '$_id.person_id',
          by_id: '$_id.by_id',
          comment: '$_id.comment',
          total: '$total',
          items_count: '$count',
          first_items: '$first_items'
        }
      }
      var sort = {
        $sort: {
          _id: -1
        }
      };

      var agg = [];
      agg.push(match);
      agg.push(unwind);
      agg.push(group);
      agg.push(project);
      agg.push(sort);


      db.operations.aggregate(agg)
        .exec(function(err, result) {
          if (err) {
            throw err
          } else if (result) {
            var count = result.length;
            result = result.slice(_from, _to);
            //
            db.persons.populate(result, {
              path: 'person_id',
              select: 'first_name last_name id -_id'
            }, function(err, popPerson_id) {
              if (err) throw err;
              if (popPerson_id) {
                db.bys.populate(popPerson_id, {
                  path: 'by_id',
                  select: 'title'
                }, function(err, popBy_id) {
                  if (err) throw err;
                  if (popBy_id) {
                    db.products.populate(popBy_id, {
                      path: 'first_items.product_id',
                      select: 'title'
                    }, function(err, _r) {

                      _r.forEach(function(r) {
                        date_to_persian(r._id.getTimestamp(), function(dte) {
                          r.date = dte.second_less_time + ' - ' + dte.date
                        });
                      });
                      res.json({
                        data: _r,
                        count: count
                      });
                    })
                  }
                  //populate
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
  };


  return _return;
})();


// {
//   $match: {
//     $or: [{
//       type: 'buy'
//     }, {
//       type: 'sale'
//     }]
//   }
// }, {
//   $unwind: '$items'
// }, {
//   $group: {
//     _id: {
//       type: '$type',
//       _id: '$_id',
//       id: '$id',
//       person_id: '$person_id',
//       by_id: '$by_id',
//       comment: '$comment'
//     },
//     first_items: {
//       $first: "$items"
//     },
//     count: {
//       $sum: {
//         $cond: {
//           if: {
//             $gt: ['$items.value', 0]
//           },
//           then: 1,
//           else: 0
//         }
//       }
//     },
//     total: {
//       $sum: {
//         $multiply: [{
//           $ifNull: [{
//             // $abs
//             $cond: {
//               if: {
//                 $lt: ['$items.value', 0]
//               },
//               then: {
//                 $subtract: [0, '$items.value']
//               },
//               else: '$items.value'
//             }
//           }, 1]
//         }, '$items.price']
//       }
//     }
//   }
// }, {
//   $project: {
//     type: '$_id.type',
//     _id: '$_id._id',
//     id: '$_id.id',
//     person_id: '$_id.person_id',
//     by_id: '$_id.by_id',
//     comment: '$_id.comment',
//     total: '$total',
//     items_count: '$count',
//     first_items: '$first_items'
//   }
// }, {
//   $sort: {
//     _id: -1
//   }
//   // }, {
//   //   $skip: _from
//   // }, {
//   //   $limit: _to - _from
// }
