//
//
//

var db = require('db');
var _ = require('lodash');

var addEdit = require('functions/product/addEdit');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {
    //
    if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
      //
      var product = req.body;
      product.creator_id = req.user._id;
      addEdit(product, function(err, status) {
        if (err) {
          next(err)
        } else if (status && status.exists) {
          res.json({
            add: false,
            exists: true
          });
          console.log(req.user.first_name + " " + req.user.last_name + " try to add a new product -> " + product.title + " but it's exists is DB");
          //
        } else if (status && status.add) {
          res.json({
            add: true
          });
          console.log(req.user.first_name + " " + req.user.last_name + " add a new product -> " + product.title);
          //
        } else if (status && status.edit) {
          res.json({
            edit: true
          })
          console.log(req.user.first_name + " " + req.user.last_name + " edit a product -> " + product.title);
          //
        } else if (status && status.error) {
          res.json({
            error : true,
            type : status.type
          })
          console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit product -> " + product.title + " (" + status.type + " )");
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

      console.log("someone try to add new user without login!!!");
    }
  };
  return _return;
})();
