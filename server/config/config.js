'use strict';

var express       = require('express'),
    exphbs        = require('express3-handlebars'),
    compress      = require('compression')(),
    session       = require('express-session'),
    MongoStore    = require('connect-mongo')(session),
    cookieParser  = require('cookie-parser');

module.exports = function(app) {

  switch (process.env.NODE_ENV) {
    case 'production':
      app.use(compress);
      setDefaults(app);
      break;
    case 'development':
      setDefaults(app);
      break;
    default:
      setDefaults(app);
      break;
  }

  function setDefaults(app) {
      var hbs;
      app.enable('strict routing');
      app.enable('case sensitive routing');
      app.use(addAppObject);
      app.set('views', __dirname + '/../views');
      hbs = exphbs.create({
        defaultLayout : 'index',
        layoutsDir    : app.get('views') + '/site/layouts',
        partialsDir   : app.get('views'),
        extname       : '.html'
      });
      app.engine('.html', hbs.engine);
      app.set('view engine', '.html');
      app.use(cookieParser());
      app.use(session({
          secret  : 'brangerOdiLight',
          store   : new MongoStore({
            db    : 'garhammar'
          })
        }));
      app.use(express.static(__dirname + '/../../public', { maxAge: 31556926 }));
  }

  function addAppObject(req, res, next) {
    req.locals          = {};
    req.locals.status   = {};
    req.locals.errors   = {};
    req.locals.view     = {};
    req.locals.toggleProdSettings = !shouldToggleDev(req.query);
    next();
  }

  function shouldToggleDev(query) {
    if (query.devMode) {
      return true;
    }
    if (query.prodMode) {
      return false;
    }
    return !isProd();
  }

  function isProd() {
    return process.env.NODE_ENV === 'production';
  }

};