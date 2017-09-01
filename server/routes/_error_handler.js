//
// all other routes use next() for their errors and
// this module will handle the errors
//
// by : elyas
// crate : 24/1/95
// edit : 24/2/95
// edit : 18/3/95

function error_handler(err, req, res, next) {

   // the error object should be someting like this :
   // { status : Number , message : String ,error_obj : Error object }

   // generate error message
   var error_message = "error message not found!";

   var ip;

   if (req.ip)
      ip = req.ip.split(':').pop();

   if (err.error_obj) {
      error_message = err.error_obj.stack || err.error_obj.message;
   } else if (err.message) {
      error_message = err.message;
   } else {
      error_message = err.status;
   }

   // interal server error
   if (err.status == 500) {
      res.status(500).json({
         err: true,
         status: 500
      });

      console.error("* internal server error -> " + error_message);
   }

   // permissions auth eror
   else if (err.status == 403) {
      res.status(403).json({
         err: true,
         status: 403
      });

      // if we know how is it.
      if (req.user) {
         console.security("* user -> " + req.user.first_name + " " + req.user.last_name + " try route -> " + req.url + " without permission.");
      } else {
         console.security("* some one try route -> " + req.url + " without permission / IP -> " + ip);
      }
   }

   // bad request
   else if (err.status == 400) {
      res.status(400).json({
         err: true,
         status: 400
      });
   }

   // else request is 404
   // not found error
   else {
      res.status(404).json({
         err: true,
         status: 404
      });

      if (req.url != '/favicon.ico') {
         if (req.user) {
            console.very_log("* user -> " + req.user.first_name + " " + req.user.last_name + " try route -> " + req.url + " but not exists.");
         } else {
            console.very_log("* some one try route -> " + req.url + " but not exists / IP -> " + ip);
         }
      }
   }
}

// export it
module.exports = error_handler;
