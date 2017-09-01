//
//
//

var db = require('db');
var _ = require('lodash');

var addEdit = require('functions/receive/addEdit');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {
    //
    if (req.user && req.user._permissions && _.includes(req.user._permissions, "root")) {
      //
      var receive = req.body;
      receive.creator_id = req.user._id;
      addEdit(receive, function(err, status) {
        if (err) {
          next(err)
        } else if (status && status.add) {
          res.json({
            add: true
          });
          console.log(req.user.first_name + " " + req.user.last_name + " add a new receive for person_id => " + receive.person_id);
          //
        } else if (status && status.edit) {
          res.json({
            edit: true
          })
          console.log(req.user.first_name + " " + req.user.last_name + " edit receive for person_id => " + receive.person_id);
          //
        } else if (status && status.error) {
          res.json({
            error: true,
            type: status.type
          })
          console.log(req.user.first_name + " " + req.user.last_name + " error in add or edit receive for person_id -> " + receive.person_id + " (" + status.type + " )");
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

      console.log("someone try to add or edit receive without login!!!");
    }
  };
  return _return;
})();
