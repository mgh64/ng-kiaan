//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');
var remove_bank = require('functions/bank/rm');

router.post('/remove_bank', function(req, res, next) {
  //
  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {

    var bank = req.body;
    remove_bank(bank, function(err, result) {
      if (err) {
        next(err)
      } else if (result) {
        res.json({
          rm: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " remove a bank with _id : -> " + bank._id);
      }
    })

  } else {

    next({
      status: 403
    });

    console.log("someone try to add delete banka without login!!!");
  }
  //
})

module.exports = router;
