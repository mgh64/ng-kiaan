//
//
// by : mostafa

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');

router.get('/branch_info', function(req, res, next) {

  // console.open(req.query);

  if (req.user && req.query && req.query.bank_id && req.query.branch) {
    //
    if (_.includes(req.user._permissions, "root")) {

      var query = {
        $and: []
      };

      query.$and.push({
        bank_id: req.query.bank_id
      })
      switch (isNaN(req.query.branch)) {
        case false:
          query.$and.push({
            id: req.query.branch
          })
          break;
        case true:
          query.$and.push({
            title: new RegExp(req.query.branch)
          })
          break;
      }
      // console.open(query);

      db.branches.find(query, {
        __v: false
      }).populate({
        path: 'bank_id',
        select: '-__v'
      }).lean().exec(function(err, branches) {
        if (err) {
          next({
            status: 500,
            error_obj: err
          })
        } else {
          // console.open(branches);
          res.json(branches);
        }
      })

    } else {
      next({
        status: 403
      });
    }
  }
})
module.exports = router;
