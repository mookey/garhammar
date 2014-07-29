'use strict';

module.exports = function(app) {

  app.get('/', function (req, res) {
    req.locals.template = '_blog';
    r(req, res);
  });

  app.get('/me', function (req, res) {
    req.locals.template = '_me';
    r(req, res);
  });

  app.get('/styles', function (req, res) {
    req.locals.template = '_styles';
    r(req, res);
  });

  app.get('/code', function (req, res) {
    req.locals.template = '_code';
    r(req, res);
  });

  function r(req, res) {
    if (req.xhr) {
      res.send(req.locals);
      return;
    }
    res.render('site/' + req.locals.template, req.locals);
  }

};