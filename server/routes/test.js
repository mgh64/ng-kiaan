var db = require('db');


  db.users.find({name : 'm'},function(err,data){
    if( data.length > 0){
      // console.log(data[0]._id.getTimestamp());
      // console.log(data);
    }
  });
