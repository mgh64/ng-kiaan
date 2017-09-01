//
// main route
//
// by : mostafa
// edit : 95/6/7


var encrypt = require('encrypt');
var db = require('db');

module.exports.get = function(req, res) {

  // if user is authed redirect  it to dashboard
  if (req.session.q) {
    res.redirect('/dashboard');
    // res.render('index');
  }

  // else render login page for him/her to login
  else {
    res.render('login');
  }
  // res.render('index',{ title : "مصطفی" });
};


module.exports.post = function(req, res) {

  var user = req.body;
  if (user.username && user.password) {
    // console.log(user);

    var query = {
      email: user.username
    };

    db.users.findOne(query, {
        password: true,
        first_name: true,
        last_name: true
      },
      function(err, contact) {
        if (err) {
          next(err);
        } else if (contact) {

          encrypt.compare(user.password, contact.password, function(ok) {

            if (ok) {
              // console.dir(req.headers.referer);
              req.session.q = String(contact._id);

              res.json({
                auth: true
              });

              console.log("auth user -> " + contact.first_name + " " + contact.last_name);

              //  require('functions/update_user_site_log')(contact._id);
              //  require('functions/login_logger')();

            } else {
              res.json({
                auth: false
              });

              console.log('try for auth -> ' + contact.first_name + " " + contact.last_name + " / { error : wrong password }");
            }
          });
        } else {

          res.json({
            auth: false
          });

          console.log('try for auth -> ' + user.username + " { error : wrong username }");
        }
      });
    //    }
    // });
  } else {
    next({
      status: 400
    });
  }
};

// module.exports.post = function(req, res) {
//
//    var user = req.body;
//
//    res.json(user);
// };
