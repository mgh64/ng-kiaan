var db = require('db');

module.exports.post = function(req, res, next) {
  next();
};

module.exports.get = function(req, res, next) {
  // console.log(req);
  db.g_persons.find({}, {
    __v: false
  }).exec(function(err, g_person) {
    if (err) {
      console.log(err);
    } else if (g_person) {
      res.json({
        data: g_person
      })
    }
  })

};
