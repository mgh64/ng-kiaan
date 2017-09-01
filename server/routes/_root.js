//
// all routes are manage from this file
// and all router files load here
//
// by : mostafa
// create : 95/6/7

var db = require('db');
var path = require('path');

// require all simple_routes file
var requireDir = require('require-dir');
var simple_routes = requireDir(path.join(__dirname, 'simple_routes'));


module.exports = function(app) {

  [
    '_bank.js',
    'print.js',
    'print_url.js'
  ].forEach(function(file_name) {
    app.use(require('./print_doc/' + file_name));
  });

  // start and index are exception
  app.use(require('./_star'));
  app.route('/')
    .get(
      require('./index').get
    ).post(
      require('./index').post
    );

  [
    'persons.js',
    'personAddEdit.js',
    'person.js',
    'person_operations.js',
    'persons_info.js',
    'person_info.js'
  ].forEach(function(file_name) {
    app.use(require('./person/' + file_name));
  });

  [
    'bank_info.js',
    'bank.js',
    'AddEdit.js',
    'remove.js'
  ].forEach(function(file_name) {
    app.use(require('./bank/' + file_name));
  });

  [
    'AddEdit.js',
    'branch_info.js'
  ].forEach(function(file_name) {
    app.use(require('./branch/' + file_name));
  });

  [
    'cash.js',
    'cash_operations.js'
  ].forEach(function(file_name) {
    app.use(require('./cash/' + file_name));
  });

  [
    'bankaccounts.js',
    'bankaccount.js',
    'bankacc_operations.js',
    'bankaccountAddEdit.js',
    'remove_bankaccount.js'
  ].forEach(function(file_name) {
    app.use(require('./bankaccount/' + file_name));
  });

  [
    'first_period.js'
  ].forEach(function(file_name) {
    app.use(require('./cheque_receive/' + file_name));
  });
  //
  [
    'receives.js',
    'receive.js'
  ].forEach(function(file_name) {
    app.use(require('./receive/' + file_name));
  });
  //
  [
    'payments.js',
    'payment.js'
  ].forEach(function(file_name) {
    app.use(require('./payment/' + file_name));
  });
  //
  [
    'transfers.js',
    'transfer.js',
    'addEdit.js'
  ].forEach(function(file_name) {
    app.use(require('./transfer/' + file_name));
  });
  //
  [
    'pn.js',
    'dj.js',
    'ph.js',
    'out.js',
    'bg.js',
    'odat.js'
  ].forEach(function(file_name) {
    app.use(require('./cheque_management/' + file_name));
  });


  // require simple routes folder by their names
  for (file_name in simple_routes) {
    app
      .route('/' + file_name)
      .get(simple_routes[file_name].get)
      .post(simple_routes[file_name].post);
  }


  // if requests come to this middleware it means
  // request is 404 status
  app.use(function(req, res, next) {

    // error was here!
    // next({
    //   status: 404
    // });

    res.status(404).send("404");

  });

  // all errors are handle here.
  app.use(require('./_error_handler.js'));
};
