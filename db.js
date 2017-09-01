

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/kiaan');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("connect to kiaan db");
});

// var bankSchema = mongoose.Schema({},{ strict: false });

var bankSchema = mongoose.Schema({
    name: String,
    // creator_id: mongoose.Types.ObjectId,
    branches: Array
});

var bank = mongoose.model('banks', bankSchema);

// bank.find({},function(err,data){
//     console.log(data)
// });

// new bank({ name : "saderat" }).save((err)=> {
//     if(err){
//         console.log("not saved")
//     } else {
//     console.log("new bank saved")
//     }
// })

module.exports.get = function(req, res, next) {
  bank.find({},function(err,data){
      res.json(data)
  });
   next();
};

module.exports.post = function(req, res, next) {
   next();
};
