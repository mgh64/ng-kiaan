var db = require('db');

module.exports.get = function(req, res, next) {
  next();
};

module.exports.post = function(req, res, next) {
  // console.log(req);
  db.users.find({}, {
    __v: false,
    password: false
  }).exec(function(err, user) {
    if (err) {
      console.log(err);
    } else if (user) {
      // console.log(user);
      res.json(user)
    }
  })
  // db.persons.find({},{id : 1, _id : 0}).sort({id:-1}).limit(1).lean().exec(function(err,id){
  //   console.log(id.length);
  //   if (err){
  //     console.log(err);
  //     return false;
  //   } else {
  //     switch (id.length) {
  //       case 0:
  //         return 1;
  //         break;
  //     }
  //   }
  // })

};
