//
//
//
var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');
var addEdit = require('functions/transfer/addEdit');

router.post('/transferAddEdit', function(req, res, next) {
  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
    //
    var transfer = req.body;
    transfer.creator_id = req.user._id;
    addEdit(transfer, function(err, status) {
      if (err) {
        next(err)
      } else if (status && status.add) {
        res.json({
          add: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " add a new transfer for person_id => " + transfer.person_id);
        //
      } else if (status && status.edit) {
        res.json({
          edit: true
        })
        console.log(req.user.first_name + " " + req.user.last_name + " edit transfer for person_id => " + transfer.person_id);
        //
      } else if (status && status.error) {
        res.json({
          error: true,
          type: status.type
        })
        console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit transfer for person_id -> " + transfer.person_id + " (" + status.type + " )");
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

    console.log("someone try to add or edit transfer without login!!!");
  }

})

module.exports = router;
