//
//
//by : mostafa
"use strict";

var express = require('express');
var router = express.Router();

var db = require('db');
var _ = require('lodash');
var addEdit = require('functions/person/addEdit');

router.post('/personAddEdit', function(req, res, next) {

  if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
    //
    var person = req.body;
    person.creator_id = req.user._id;
    addEdit(person, function(err, status) {
      if (err) {
        next(err)
      } else if (status && status.exists) {
        res.json({
          add: false,
          exists: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " try to add a new user -> " + person.first_name + " " + person.last_name + " but he/she exists is DB");
        //
      } else if (status && status.add) {
        res.json({
          add: true
        });
        console.log(req.user.first_name + " " + req.user.last_name + " add a new user -> " + person.first_name + " " + person.last_name);
        //
      } else if (status && status.edit) {
        res.json({
          edit: true
        })
        console.log(req.user.first_name + " " + req.user.last_name + " edit a user -> " + person.first_name + " " + person.last_name);
        //
      } else if (status && status.error) {
        res.json({
          error : true,
          type : status.type
        })
        console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit user -> " + person.first_name + " " + person.last_name + " (" + status.type + " )");
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

    console.log("someone try to add new person without login!!!");
  }

})

module.exports = router;
