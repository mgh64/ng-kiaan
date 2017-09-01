//
// init data of mongo if it was empty
//
// by : mostafa

// "use strict";

var db = require('db');
var enc = require('encrypt');

// data of the init user of DB
var init_user_data = {
  first_name: "مدیر",
  last_name: "سیستم",
  pass: "640120",
  email: "mostafa.gh64@gmail.com",
  mobile: "09377777777",
  gender: true
};

// permission of system
var init_permissions = [{
  name: "root",
  title: "دسترسی کامل"
}, {
  name: "persons",
  title: "طرف حسابها"
}, {
  name: "shareholders",
  title: "سهامدار"
}, {
  name: "bank accounts",
  title: "حساب های بانکی"
}];

var init_g_persons_data = {
  title: "مشتری"
};

var init_units_data = {
  title: "مثقال"
};

var init_g_product_data = {
  title: "عمومی"
}

var init_costs_data = [{
  id: 1,
  title: 'تخفیف'
}, {
  id: 2,
  title: 'مالیات'
}, {
  id: 3,
  title: 'کرایه'
}, {
  id: 4,
  title: 'کارمزد بانک'
}, {
  id: 5,
  title: 'متفرقه'
}, {
  id: 6,
  title: 'قبوض'
}, {
  id: 7,
  title: 'ماشین'
}, {
  id: 8,
  title: 'آبکاری'
}];

var init_incomes_data = [{
  id: 1,
  title: 'تخفیف'
}, {
  id: 2,
  title: 'مالیات'
}, {
  id: 3,
  title: 'کرایه'
}, {
  id: 4,
  title: 'سود سپرده بانکی'
}, {
  id: 5,
  title: 'متفرقه'
}];
// if g_users collection is empty
db.g_users.count(function(err, c) {
  if (err) {
    console.error(err);
  } else if (c == 0) {
    var root = {
      title: "مدیر سیستم",
      name: "root",
      permissions: ['root']
    };

    // save permissions one by one
    init_permissions.forEach(function(permission) {
      // add permission name stings to root permission array
      //  root.permissions.push(permission.name);

      // save permission in DB
      new db.permissions(permission).save(function(err) {
        if (err) console.error(err);
      });
      console.log("* init permission -> " + permission.name);
    });

    // save root task
    new db.g_users(root).save(function(err, _root) {
      if (err) console.error(err);
      else if (_root) {
        // pass root _id to save in init user task
        init_users(_root._id);
        console.log("* init task -> " + root.title);
      }
    });
  } else {
    // check for new added tasks to add to db
    init_permissions.forEach((permission) => {
      check_permission(permission);
    });
  }
});

// init first user
function init_users(root_group_id) {

  db.users.count(function(err, c) {

    if (c == 0) {
      enc.hash(init_user_data.pass, function(hash) {

        init_user_data.group_id = [];
        init_user_data.group_id.push(root_group_id);

        init_user_data.password = hash;

        new db.users(init_user_data).save(function(err) {
          if (err) {
            console.log(err);
          } else {
            init_g_persons();
            init_unit();
            init_g_products();
            init_costs();
            init_incomes();
            require('../mongo/init_branch');
            console.log("* init root user -> username(email) -> " + init_user_data.email + " / password -> " + init_user_data.pass);
          }
        });

      });
    }
  });
}

function init_g_persons() {
  new db.g_persons(init_g_persons_data).save(function(err) {
    if (err) console.log(err);
    else console.log("* init g_persons -> 'مشتری' ");
  });
};

function init_unit() {
  new db.units(init_units_data).save(function(err) {
    if (err) console.log(err);
    else console.log("* init unit -> 'مثقال' ");
  });
};

function init_g_products() {
  new db.g_products(init_g_product_data).save(function(err) {
    if (err) console.log(err);
    else console.log("* init g_products -> 'عمومی' ");
  });
};

function init_costs() {
  init_costs_data.forEach(function(r) {
    new db.costs(r).save(function(err) {
      if (err) console.log(err);
      else console.log("* init new cost -> " + r.title);
    });
  })
};

function init_incomes() {
  init_incomes_data.forEach(function(r) {
    new db.incomes(r).save(function(err) {
      if (err) console.log(err);
      else console.log("* init new income -> " + r.title);
    });
  })
};

function check_permission(permission) {
  db.permissions.findOne({
    name: permission.name
  }, {
    _id: true
  }).lean().exec((err, exists) => {
    if (err) {
      console.error(err);
    } else if (!exists) {
      //  console.log("not exists -> " + permission.name);
      new db.permissions(permission).save(function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("* init permission -> " + permission.name);
        }
      });
    } else {
      //  console.log("exists -> " + permission.name);
    }
  });
};
