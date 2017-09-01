var db = require('db');

module.exports.get = function(req, res, next) {
  next();
};

module.exports.post = function(req, res, next) {
  // console.log(req);
  if (req.user){
    var new_user = {
      first_name: "الیاس",
      last_name: "قاسمی",
      gender: true,
      mobile: "09377777777",
      email: "egh74@gmail.com",
      pass: "qwerty",
    };

  }

};
