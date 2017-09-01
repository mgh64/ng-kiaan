//
//
// by : mostafa

var db = require('db');
var _ = require('lodash');
module.exports = (function() {

  var _return = {};

  _return.get = function(req, res) {
    next();
  };

  _return.post = function(req, res, next) {

    // console.open(req.body.ids[0]);

    if (_.includes(req.user._permissions, "root")) {
      //
      if (req.body) {
        //
        db.operations.findOne({
          items: {
            $elemMatch: {
              _id: req.body.ids[0]
            }
          }
        }, function(err, _r) {
          if (err) throw err;
          //
          var el, val = [];
          _r.items.forEach(function(itm) {
            if (itm._id == req.body.ids[0]) {
              if (itm.status == 'pn') {
                el = ['status', 'pn_date'];
              } else if (itm.status == 'dj') {
                el = ['status', 'dj_date', 'bankacc_id'];
              } else if (itm.status == 'ph'){
                itm.status = 'dj';
                el = ['ph_date'];
              } else if (itm.status == 'bg') {
                // val.push({status : 'dj'})
                itm.status = 'dj';
                el = ['bg_date'];
              } else if (itm.status == 'od'){
                if (!itm.bg_date){
                  el = ['status', 'od_date'];
                } else {
                  itm.status = 'bg';
                  el = ['od_date'];
                }
              }
              if (el.length) {
                el.forEach(function(attr) {
                  itm[attr] = val[attr];
                });
              }
            }
          })
          _r.save(function(err, result) {
            if (err) {
              throw err;
            } else {
              res.json({
                commit: true
              });
            }
          })
          //
          // res.json({})
        })
        //
      } else {
        res.json({
          valid: false
        });
      }
      //
    } else {
      next({
        status: 403
      });
    }

  };

  return _return;

})();
