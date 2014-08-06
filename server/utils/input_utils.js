'use strict';

var sanitize    = require('google-caja').sanitize,
    _           = require('underscore'),
    formidable  = require('formidable'),
    fs          = require('fs'),
    utils       = {};

_.str = require('underscore.string');
_.mixin(_.str.exports());

utils.sanitize = function(input) {
  var text;
  if (!input) {
    return '';
  }
  text = _.trim(sanitize(input));
  text = text.replace(/(<([^>]+)>)/ig,"");
  text = text.replace(/\r\n/g, '<br/>').replace(/[\r\n]/g, '<br/>');
  return text;
};

utils.convertFields = function(req, res, next) {
  var form = new formidable.IncomingForm();
  var filenamePath;
  form.uploadDir = __dirname + '/../../public/img/org/tmp';
  form.keepExtensions = true;
  form.encoding = 'utf-8';
  form.parse(req, function(err, fields, files) {

    if (err) {
      throw err;
    }
    if (_.isEmpty(files)) {
      req.fields = fields;
      req.body = req.body || {};
      if ('/admin/login' === req.path) {
        req.body.username = fields.username;
        req.body.password = fields.password;
      }
      next();
      return;
    }

    filenamePath = form.uploadDir + "/" + files.name.name; 
    fs.rename(files.name.path, filenamePath, function (err) { 
      if (err) {
        throw err;
      }
      req.fields = fields;
      req.fields.filenamePath = filenamePath;
      req.fields.filename = files.name.name;
      next();
      return;
    });

  });
};


module.exports = utils;