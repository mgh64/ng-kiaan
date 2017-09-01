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
      if (req.body && req.body._id){

        db.operations.findOne({
          _id: req.body._id
        }).lean().exec(function(err, result) {
          if (err) throw err
          if (result) {
            result.items.forEach(function(r){
              r.value = Math.abs(r.value);
              if (result.type == 'sale' && (r.cost_id || r.income_id)){
                r.price = -r.price;
              }
            });
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
