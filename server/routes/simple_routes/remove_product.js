//
//
//

var db = require('db');
var _ = require('lodash');

var remove_product = require('functions/product/rm');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {


    if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {

      var product = req.body;
      remove_product(product, function(err, result) {
        if (err) {
          next(err)
        } else if (result) {
          res.json({
            rm: true
          });
          console.log(req.user.first_name + " " + req.user.last_name + " remove a product with _id : -> "  + product._id);
        }
      })

    } else {

      next({
        status: 403
      });

      console.log("someone try to add delete product without login!!!");
    }
  };
  return _return;
})();
