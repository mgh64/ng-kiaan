//
//
//

var db = require('db');
var _ = require('lodash');

var addEdit = require('functions/invoice/addEdit');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {
    //
    if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
      //
      var invoice = req.body;
      invoice.creator_id = req.user._id;
      addEdit(invoice, function(err, status) {
        if (err) {
          next(err)
        } else if (status && status.add) {
          res.json({
            add: true
          });
          console.log(req.user.first_name + " " + req.user.last_name + " add a new invoice for person_id => " + invoice.person_id);
          //
        } else if (status && status.edit) {
          res.json({
            edit: true
          })
          console.log(req.user.first_name + " " + req.user.last_name + " edit a new invoice for person_id => " + invoice.person_id);
          //
        } else if (status && status.error) {
          res.json({
            error: true,
            type: status.type
          })
          console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit invoice for person_id -> " + invoice.person_id + " (" + status.type + " )");
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

      console.log("someone try to add new invoice without login!!!");
    }
  };
  return _return;
})();
