//
// all req to server come to this route and validate , if someone try to
// access other routers should loged in first and then this route granted
// he/she.
//
// by : mostafa
// create : 95/6/7

var db = require('db');
var _ = require('lodash');
var utl = require('my_utils');


// if we want a guest users to access a router we can insert it in this
// array and it will be open to any one.

var include_guest = [
   '/',
   '/del',
   '/register'
];


module.exports = (function() {
   var _return = {};

   _return = function(req, res, next) {

      // console.log(req.url);

      // if under construct mode is when server is up but we don't want any
      // req to server or DB.
      if (global.init.under_cosnstruct_mode) {
         res.status('200').send(
            "<br><br><h3 align=\"center\">.با عرض پوزش سایت موقتا به دلیل تغییرات بسته است، لطفا کمی بعد مجدد تلاش کنید</h3>"
         );
      } else {

         if (_.includes(include_guest, req.url)) {
            next();

            // else if user have a valid session
         } else if (req.session.q) {
            // we should validate and find user of this session
            db.users.findOne({
                  _id: req.session.q
               }, {
                  __v: false
               })
               .populate({
                  path: 'group_id',
                  select: '-__v'
               }).lean().exec(function(err, user) {
                  if (user) {
                    // console.log(user);
                     user._permissions = [];
                     user.g_users = [];

                     // for better access to data we merge all tasks permissions
                     // of this user, note that any user can have many tasks
                     // and we merge all of their permissions and pass it to
                     // next router
                     if (!user.disable && user.group_id && user.group_id.length > 0) {
                        user.group_id.forEach(function(t) {
                           if (!t._disable) {
                              user.g_users.push(t._id);
                              // console.log(t.permissions);
                              user._permissions = Array.merge(user._permissions, t.permissions);
                           }
                        });
                     }
                    //  console.log(user);
                     req.user = user;
                     next();
                  } else {
                     // and if the session is not valid we send it to /del :)
                     //  console.security("* some one try route -> " + req.url + " with not valid session! / IP -> " + ip);
                     res.redirect('/login');
                  }
               });

            // this is when user haven't session and if it is a guest route,
            // user can access it.
         } else {
            // else it goes to /del hell :)
            // console.very_log("* some one try route -> " + req.url + " but not exists / IP -> " + ip);
            res.redirect('/login');
         }
      }
   };

   return _return;
})();
