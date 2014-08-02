'use strict';

module.exports = function(app) {

  app.get('/admin/pics', function (req, res) {
    req.locals.template = '_admin_pics';
    r(req, res);
  });
  
  app.get('/admin/users', function (req, res) {
    req.locals.template = '_admin_users';
    r(req, res);
  });

  app.get('/admin/blog', function (req, res) {
    req.locals.template = '_admin_blog';
    r(req, res);
  });
 
   app.get('/admin/login', function (req, res) {
    req.locals.template = '_admin_login';
    r(req, res);
  }); 

   app.post('/admin/login', function (req, res) {
    req.locals.template = '_admin_login';
    req.locals.username = 'fucker';
    req.locals.errors = {};
    req.locals.errors.username = {};
    req.locals.errors.username.message = 'Incorrect username or password';
    r(req, res);
  }); 

  function r(req, res) {
    res.locals.layout = 'admin';
    if (req.xhr) {
      res.send(req.locals);
      return;
    }
    res.render('admin/' + req.locals.template, req.locals);
  }

};