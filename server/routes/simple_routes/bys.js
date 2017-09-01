//
//
// by : mostafa

var db = require('db');
var _ = require('lodash');

module.exports = (function() {

  var _return = {};

  _return.post = function(req, res, next) {
    next();
  };

  _return.get = function(req, res, next) {
    if (_.includes(req.user._permissions, "root")) {

      db.bys.find({}, {
        _id: true,
        person_id: true,
        title: true
      }).sort({
        _id: 1
      }).lean().exec(function(err, bys) {
        if (err) {
          throw err;
        } else {
          res.json(bys);
        }
      });

    } else {
      next({
        status: 403
      });
    }
  };


  return _return;
})();
