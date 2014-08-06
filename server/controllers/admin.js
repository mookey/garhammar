'use strict';

var input_utils = require('../utils/input_utils.js');
var users       = require('../models/users');
var pics        = require('../models/pics');
var passport    = require('passport');
var _           = require('underscore');
var im          = require('imagemagick');
var fs          = require('fs');
var async       = require('async');

module.exports = function(app) {

  var dimensions = {
    XS  : 200,
    S   : 320,
    M   : 640,
    L   : 840,
    XL  : 1080
  };

  app.get('/admin/pics', function(req, res) {
    req.locals.template = 'pics/_admin_pics';
    r(req, res);
  });

  app.post('/admin/pics/upload', input_utils.convertFields, function(req, res) {
    req.locals.template = 'pics/_admin_pics_upload';
    im.identify(req.fields.filenamePath, function(err, features){
      if (err) {
        throw err;
      }
      var errors;
      var aspect = features.width / features.height;
      var filename = input_utils.sanitize(req.fields.filename).split('.');
      var pic = pics.create({
        filename : filename[0],
        ext : filename[1],
        name : '',
        desc : '',
        vertical : aspect < 1,
        tags : [],
        xs    : {
          width : dimensions.XS,
          height : (dimensions.XS / aspect)
        },
        s    : {
          width : dimensions.S,
          height : (dimensions.S / aspect)
        },
        m    : {
          width : dimensions.M,
          height : (dimensions.M / aspect)
        },
        l    : {
          width : dimensions.L,
          height : (dimensions.L / aspect)
        },
        xl    : {
          width : dimensions.XL,
          height : (dimensions.XL / aspect)
        }
      });
      errors = pic.validate();
      if (!_.isEmpty(errors)) {
        req.locals.alert = {
          isError : true,
          message : 'Error!'
        };
        r(req, res, 400);
        return;
      }
      pic.save(function(err, p) {
        if (!err) {
          fs.createReadStream(req.fields.filenamePath).pipe(fs.createWriteStream(req.fields.filenamePath.replace('org/tmp', 'org')));
          req.locals.alert = {
            message : 'Saved!'
          };
          fs.appendFile(__dirname + '/../../public/img/trigger.js', '\n' + new Date() + ' : ' + req.fields.filename, function(err) {
            if(err) {
              req.locals.alert = { isError : true, message : 'Oops, wrong, just wrong'};
              r(req, res, 500);
              return;
            } else {
              r(req, res);
              return;
            }
          });
        }
      });
    });
  });
  
  app.get('/admin/users', function (req, res) {
    req.locals.template = 'users/_admin_users';
    r(req, res);
  });

  app.post('/admin/users/create', input_utils.convertFields, function (req, res) {

    var u,
        error,
        errors,
        message,
        key;

    u = users.create({
      username    : input_utils.sanitize(req.fields.username),
      email       : input_utils.sanitize(req.fields.email),
      password    : input_utils.sanitize(req.fields.password),
      permission  : input_utils.sanitize(req.fields.permission)
    });

    errors = u.validate(input_utils.sanitize(req.fields.confirm_password));

    req.locals.template = 'users/_admin_users_create';
    if (!_.isEmpty(errors)) {
      req.locals.errors = errors;
      req.locals.fields = req.fields;
      r(req, res, 400);
      return;
    }

    u.save(function(err, user) {
      if (!err) {
        req.locals.alert = {
          message : 'Saved!'
        };
        r(req, res);
        return;
      }

      if (err.code === 11000) {
        // fugly
        if (err.err.indexOf('email') > -1) {
          key = 'email';
          error = 'This email address ';
        } else {
          key = 'username';
          error = 'This username ';
        }
        req.locals.alert = {
          isError : true,
          message : 'Error!'
        };
        req.locals.errors[key] = { message : error + 'is already registered.' };
        r(req, res, 400);
        return;
      }

      req.locals.alert = { isError : true, message : 'Oops, wrong, just wrong'};
      r(req, res, 500);

    });

  });

  app.get('/admin/blog', function (req, res) {
    req.locals.template = '_admin_blog';
    r(req, res);
  });
 
   app.get('/admin/login', function (req, res) {
    req.locals.template = '_admin_login';
    r(req, res);
  }); 

  app.post('/admin/login', input_utils.convertFields, authenticate, function (req, res) {
    r(req, res);
  }); 

  function r(req, res, status) {
    res.locals.layout = 'admin';
    if (req.xhr) {
      req.locals.template = req.locals.template.split('/').pop();
      if (!status) {
        status = 200;
      }
      res.send(status, req.locals);
      return;
    }
    res.render('admin/' + req.locals.template, req.locals);
  }

  function authenticate(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        req.locals.template = '_admin_login';
        req.locals.fields = req.locals.fields || {};
        req.locals.fields.username = req.fields.username;
        req.locals.errors.username = {};
        req.locals.errors.username.message = 'Incorrect username or password';
        res.send(401, req.locals);
        return;
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return next();
      });
    })(req, res, next);
  }

};