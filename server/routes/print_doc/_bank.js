//
//
// by mostafa

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var db = require('db');

router.get('/bank_info', function(req, res, next) {
  // if (_.includes(req.user._permissions, "root")) {
  //
  res.json([{
      'id': 1,
      'productName': 'Product 1',
      'productCode': '0011'
    },
    {
      'id': 2,
      'productName': 'Product 2',
      'productCode': '0023'
    },
    {
      'id': 5,
      'productName': 'Product 5',
      'productCode': '0048'
    },
    {
      'id': 8,
      'productName': 'Product 8',
      'productCode': '0022'
    },
    {
      'id': 10,
      'productName': 'Product 10',
      'productCode': '0042'
    }
  ]);
  // db.banks.find({}, {
  //   __v: false
  // }).sort({
  //   _id: -1
  // }).lean().exec(function(err, banks) {
  //   if (err) {
  //     next({
  //       status: 500,
  //       error_obj: err
  //     })
  //   } else {
  //     res.json(banks);
  //     // res.json({"profile":{"username":"eric","bio":"Cofounder of Thinkster.io, kinda looks like Peeta from the Hunger Games","image":"http://i.imgur.com/S66L2XZ.jpg","following":false}});
  //   }
  // })

  // } else {
  //   next({
  //     status: 403
  //   });
  // }
})

router.get('/bank_info/1', function(req, res, next) {
  res.json({
    data: {
      'id': 1,
      'productName': 'Product 1',
      'productCode': '0011'
    }
  });
})
router.get('/bank_info/2', function(req, res, next) {
  res.json({
    data: {
      'id': 2,
      'productName': 'Product 2',
      'productCode': '0023'
    }
  });
})
router.get('/bank_info/1/edit', function(req, res, next) {
  res.json({
    data: {
      'id': 1,
      'productName': 'Product 1',
      'productCode': '0011'
    }
  });
})

module.exports = router;
