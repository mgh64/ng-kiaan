var db = require('db');

module.exports.post = function(req, res, next) {
  next();
};

module.exports.get = function(req, res, next) {
  // console.log(req);
  db.units.find({}, {
    __v: false
  }).exec(function(err, result) {
    if (err) {
      console.log(err);
    } else if (result) {
      res.json(result)
    }
  })

};
