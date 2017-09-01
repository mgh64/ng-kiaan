//
//
// by mostafa

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db = require('db');
var addEdit = require('functions/cheque_ft/addEdit');

router.post('/add_cheque_ft', function(req, res, next) {
  // console.dir(req.body);
  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
    //
    var cheque_ft = req.body;
    cheque_ft.creator_id = req.user._id;
    addEdit(cheque_ft, function(err, status) {
      if (err) {
        next(err)
      } else if (status && status.add) {
        res.json({
          add: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " add a new cheque_ft  => " + cheque_ft.serial);
        //
      } else if (status && status.edit) {
        res.json({
          edit: true
        })
        console.log(req.user.first_name + " " + req.user.last_name + " edit cheque_ft  => " + cheque_ft.serial);
        //
      } else if (status && status.error) {
        res.json({
          error: true,
          type: status.type
        })
        console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit cheque_ft -> " + cheque_ft.serial + " (" + status.type + " )");
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

    console.log("someone try to add or edit cheque_ft without login!!!");
  }

})

module.exports = router;
