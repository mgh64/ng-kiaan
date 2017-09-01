//
// this module delete all session of req sender user
//
module.exports = (function() {
   var _return = {};

   _return.get = function(req, res) {
      if (global.init.redis) {
         req.session.destroy();
      } else {
         req.session = null;
      }
      res.render('login');
      // res.redirect('/login');
   };

   _return.post = function(req, res) {
      next();
   };

   return _return;
})();
