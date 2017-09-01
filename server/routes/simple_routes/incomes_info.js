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

      db.incomes.aggregate({
        $project: {
          _id: 1,
          id: 1,
          title: 1
        }
      }, {
        $sort: {
          _id: 1
        }
      }).exec(function(err, info) {
        if (err) {
          throw err
        } else if (info) {
          res.json(info);
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
