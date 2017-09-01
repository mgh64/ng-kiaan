//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');
var remove_bankaccount = require('functions/bankaccount/rm');

router.post('/remove_bankaccount', function(req, res, next) {
  //
  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {

    var bankaccount = req.body;
    remove_bankaccount(bankaccount, function(err, result) {
      if (err) {
        next(err)
      } else if (result) {
        res.json({
          rm: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " remove a bankaccount with _id : -> " + bankaccount._id);
      }
    })

  } else {

    next({
      status: 403
    });

    console.log("someone try to add delete bankaccount without login!!!");
  }
  //
})

module.exports = router;
