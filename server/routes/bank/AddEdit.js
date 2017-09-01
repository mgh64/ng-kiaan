//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');
var addEdit = require('functions/bank/addEdit');

router.post('/bankAddEdit', function(req, res, next) {
  //
  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
    //
    var bank = req.body;
    bank.creator_id = req.user._id;
    addEdit(bank, function(err, status) {
      if (err) {
        next(err)
      } else if (status && status.add) {
        res.json({
          add: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " add a new bank  => " + bank.title);
        //
      } else if (status && status.edit) {
        res.json({
          edit: true
        })
        console.log(req.user.first_name + " " + req.user.last_name + " edit bank  => " + bank.title);
        //
      } else if (status && status.error) {
        res.json({
          error: true,
          type: status.type
        })
        console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit bank -> " + bank.title + " (" + status.type + " )");
        //
      } else if (status && status.not_valid) {
        res.json({
          valid: false
        });
        console.log(req.user.first_name + " " + req.user.last_name + " -> not valid data");
        //
      }
    })

  } else {

    next({
      status: 403
    });

    console.log("someone try to add or edit bank account without login!!!");
  }

  //
})

module.exports = router;
