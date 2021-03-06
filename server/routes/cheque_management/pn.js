//
//
// by mostafa

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var _ = require('lodash');
var db = require('db');

var _async = require('async');

router.post('/cheque_pn', function(req, res, next) {
  //
  if (_.includes(req.user._permissions, "root")) {
    if (req.body.ids.length) {
      //
      validate(req.body.ids, function(err, result) {
        //
        if (err) res.json(null, {
          valid: false
        });
        if (result.valid == true) {
          //
          db.operations.find({
            items: {
              $elemMatch: {
                $and: [{
                  _id: {
                    $in: req.body.ids
                  }
                }, {
                  $or: [{
                    status: {
                      $exists: false
                    }
                  }, {
                    status: {
                      $eq: "bg"
                    }
                  }]
                }]
              }
            }
          }, function(err, _r) {
            if (err) throw err;
            _async.each(_r, function(obj, cb) {

              obj.items.forEach(function(itm) {
                req.body.ids.forEach(function(r) {
                  if (r == itm._id) {
                    itm.status = "pn";
                    itm.pn_date = mongoose.Types.ObjectId();

                    obj.save(function(err) {
                      if (err) {
                        throw err;
                      } else {
                        cb();
                      }
                    })
                  }
                })
              })
            }, function() {
              res.json({
                commit: true
              });
            });
            //
          })
        } else {
          res.json({
            valid: false
          });
        }
      })
      //
    } else {
      res.json({
        valid: false
      });
    }
  } else {
    next({
      status: 403
    });
  }
  //
});

module.exports = router;

function validate(_ids, cb) {

  // console.open(_ids);
  cb = cb || function() {};
  //
  db.operations.count({
    items: {
      $elemMatch: {
        $and: [{
          _id: {
            $in: _ids
          }
        }, {
          $and: [{
            status: {
              $exists: true
            }
          }, {
            status: {
              $ne: "bg"
            }
          }]
        }]
      }
    }
  }).exec(function(err, result) {
    if (err) return cb({
      error: err,
      valid: false
    })
    if (result == 0) {
      return cb(null, {
        valid: true
      });
    } else {
      return cb(null, {
        valid: false
      });
    }
  });
  //

};
