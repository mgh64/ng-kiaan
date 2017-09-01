var _ = require('lodash');

module.exports.get = function(req, res, next) {
  next();
};

module.exports.post = function(req, res, next) {

  if (req.user) {

    // console.log(req.user);

    var init = {
      "user": {
        "_id": req.user._id,
        "first_name": req.user.first_name,
        "last_name": req.user.last_name
      },
      "menus": [{
          "title": "تعاریف پایه",
          "icon": "fa-list",
          "link": "#",
          "subs": [{
            "title": "اشخاص",
            "link": "#/persons"
          }, {
            "title": "سهامداران",
            "link": "#/invoices"
          }, {
            "title": "فهرست کالاها",
            "link": "#/products"
          }, {
            "title": "لیست حساب های بانکی",
            "link": "#/bankaccounts"
          }, {
            "title": "دسته چک",
            "link": "#/receives"
          }, {
            "title": "موجودی نقدی اول دوره",
            "link": "#/payments"
          }, {
            "title": "لیست هزینه ها",
            "link": "#/transfers"
          }, {
            "title": "لیست درامدهای متفرقه",
            "link": "#/personOperations"
          }, {
            "title": "لیست خدمات",
            "link": "#/del"
          }]
        }

      ],
      "version": global.init.version
    };

    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "add_single_user")) {
    //   init.menus.push({
    //     "title": "افزودن کاربر",
    //     "icon": "fa-plus-circle",
    //     "link": "#/user/new"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "see_all_users")) {
    //   init.menus.push({
    //     "title": "لیست اعضا",
    //     "icon": "fa-list-ol",
    //     "link": "#/user/list"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "logs")) {
    //   init.menus.push({
    //     "title": "لاگ سرور",
    //     "icon": "fa-terminal",
    //     "link": "/logs/all/30"
    //   });
    // }
    //
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "task")) {
    //   init.menus.push({
    //     "title": "تعریف مسئولیت ها",
    //     "icon": "fa-tasks",
    //     "link": "#/task"
    //   });
    // }
    //
    // // if (_.includes(req.user._permissions, "root") ||
    // //    _.includes(req.user._permissions, "add_many_user")) {
    // //    init.menus.push({
    // //       "title": "افزودن گروهی کاربر",
    // //       "icon": "fa-group",
    // //       "link": "#/user/add_file"
    // //    });
    // // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "message") ||
    //   _.includes(req.user._permissions, "message_to_every_one")
    // ) {
    //   var label = {};
    //   //  if (messages && messages.length > 0) {
    //   // label = {
    //   //        "text": "2",
    //   //        "style": "label-danger"
    //   //     }
    //   //  }
    //   init.menus.push({
    //     "title": "پیام",
    //     "label": label,
    //     "icon": "fa-envelope",
    //     "link": "#/message"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "add_news")) {
    //   init.menus.push({
    //     "title": "اضافه کردن خبر",
    //     "icon": "fa-rss",
    //     "link": "#/add_news"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "form_generator")) {
    //   init.menus.push({
    //     "title": "فرم ساز",
    //     "icon": "fa-desktop",
    //     "link": "#/form_generator"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "request_generator")) {
    //   init.menus.push({
    //     "title": "تعریف درخواست ها",
    //     "icon": "fa-pencil-square-o",
    //     "link": "#/request_generator"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root")) {
    //   init.menus.push({
    //     "title": "تنظیمات سیستم",
    //     "icon": "fa-cogs",
    //     "link": "#/main_config"
    //   });
    // }
    //
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "init_request")) {
    //   init.menus.push({
    //     "title": "درخواست های مجاز",
    //     "icon": "fa-exchange",
    //     "link": "#/request/new"
    //   });
    //
    //   init.menus.push({
    //     "title": "درخواست های در انتظار تایید",
    //     "icon": "fa-folder-open-o",
    //     "link": "#/request/pending"
    //   });
    // }
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "request_reply")) {
    //   init.menus.push({
    //     "title": "کارتابل",
    //     "icon": " fa-random",
    //     "link": "#/request/portal"
    //   });
    // }
    //
    //
    // if (_.includes(req.user._permissions, "root") ||
    //   _.includes(req.user._permissions, "init_request") ||
    //   _.includes(req.user._permissions, "request_reply")) {
    //   init.menus.push({
    //     "title": "ارشیو پرونده های من",
    //     "icon": "fa-archive",
    //     "link": "#/request/my_archive"
    //   });
    // }

    res.json(init);

  } else {
    next({
      status: 403
    });
  }
};
