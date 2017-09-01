//
//
// by : mostafa
"use strict";

const mongoose = require('mongoose');
const db = require('db');
// const encrypt = require('encrypt');
// const date_to_persian = require('functions/date_to_persian');

module.exports = function(data, cb) {

  cb = cb || function() {};
  if (!data) {
    cb({
      status: 400,
      message: "low args"
    });
  } else {
    //
    // console.open(data);
    var match = {
      $match: {
        $and: [{
          $or: [{
            person_id: mongoose.Types.ObjectId(data)
          }, {
            "items.person_id": mongoose.Types.ObjectId(data)
          }]
        }, {
          type: {
            $ne: "cheque_ft"
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
          person_id: mongoose.Types.ObjectId(data)
        }, {
          $and: [{
            "items.type": "cheque"
          }, {
            "items.status": "od"
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
        sum: {
          $sum: {
            $multiply: [{
              $ifNull: ['$items.value', 1]
            }, '$items.price']
          }
        }
      }
    };
    var group2 = {
      $group: {
        _id: {
          person_id: '$person_id'
        },
        sum: {
          $sum: {
            $subtract: [
              0,
              '$items.price'
            ]
          }
        }
      }
    };
    var project = {
      $project: {
        _id: false,
        person_id: '$_id.person_id',
        // sum: '$sum'
        remaining: {
          $subtract: [
            0,
            '$sum'
          ]
        }
      }
    };

    var agg = [];
    var agg2 = [];

    agg.push(match);
    agg.push(unwind);
    agg.push(group);
    agg.push(project);

    agg2.push(match2);
    agg2.push(unwind);
    agg2.push(match2);
    agg2.push(group2);
    agg2.push(project);

    db.operations.aggregate(
      agg
    ).exec(function(err, result) {
      if (err) console.log(err);
      if (result) {
        console.open(result);
        db.operations.aggregate(
          agg2
        ).exec(function(err, res){
          if (err) console.log(err);
          if (res){
            res.forEach(function(r){
              result.push(r);
            })
            // db.persons.populate(result, {
            //   path: 'person_id',
            //   select: 'first_name last_name id credit_limit'
            // }, function(err, info) {
            //   if (err) throw err;
            //   if (info) {
            //     console.open(info);
            //     return cb(null, info[0])
            //   }
            // })//populate

          }
        })

      }
    });
  }

}
