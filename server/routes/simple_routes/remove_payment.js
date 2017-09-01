//
//
//

var db = require('db');
var _ = require('lodash');

var remove_payment = require('functions/payment/rm');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {


    if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {

      var payment = req.body;
      remove_payment(payment, function(err, result) {
        if (err) {
          next(err)
        } else if (result) {
          res.json({
            rm: true
          });
          console.log(req.user.first_name + " " + req.user.last_name + " remove a payment with _id -> "  + payment._id);
        }
      })

    } else {

      next({
        status: 403
      });

      console.log("someone try to add delete payment without login!!!");
    }
  };
  return _return;
})();
