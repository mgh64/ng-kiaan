//
// render the main page after auth
//
// by : mostafa

const generate_menu = require('functions/generate_menu');

module.exports = (function() {

   var _return = {};

   _return.get = function(req, res) {
     generate_menu(req.user._permissions, function(err, menu) {
       // console.open(menu);
       res.render('index', {
         menus: menu
       });
     })
      // res.render('index');
   };

   _return.post = function(req, res) {
      next();
   };

   return _return;
})();
