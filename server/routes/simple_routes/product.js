//
//
// by : mostafa

var db = require('db');
var _ = require('lodash');
module.exports = (function() {

  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {

    // console.log(req.body);

    if (_.includes(req.user._permissions, "root")) {
      if (req.body && req.body._id) {

        // console.log(req.body._id);
        db.operations.find({
            'items.product_id': req.body._id,
            type: 'first_period'
          },{
            __v : false
          })
          .populate({
            path: 'items.product_id',
            select: '-__v'
          }).lean().exec(function(err, result) {
            if (err) throw err
            else if (result) {
              res.json(result);
            }
          });

      }
    } else {
      next({
        status: 403
      });
    }
  };


  return _return;
})();
