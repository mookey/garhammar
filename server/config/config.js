'use strict';

var express       = require('express'),
    exphbs        = require('express3-handlebars'),
    compress      = require('compression')(),
    session       = require('express-session'),
    MongoStore    = require('connect-mongo')(session),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcrypt'),
    users         = require('../models/users.js');

module.exports = function(app) {

  switch (process.env.NODE_ENV) {
    case 'production':
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
      var maxAge = 1000 * 60 * 60 * 24 * 365;
      app.enable('strict routing');
      app.enable('case sensitive routing');
      app.use(compress);
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
      app.use(bodyParser.json());
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(express.static(__dirname + '/../../public', { maxAge: maxAge }));
  }

  function addAppObject(req, res, next) {
    req.locals          = {};
    req.locals.alert    = {};
    req.locals.errors   = {};
    req.locals.view     = {};
    req.locals.fields   = {};
    req.locals.toggleProdSettings = !shouldToggleDev(req);
    next();
  }

  function shouldToggleDev(req) {
    if (req.param('devMode') === '1') {
      return true;
    }
    if (req.param('prodMode') === '1') {
      return false;
    }
    return !isProd();
  }

  function isProd() {
    return process.env.NODE_ENV === 'production';
  }

};

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  users.findByUsername(username, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    users.findByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, {
              messages : ['Incorrect username or password']
          });
        }
        bcrypt.compare(password, user.password, function(err, res) {
          if (res) {
            return done(null, user);
          }
          return done(null, false, {
              messages : ['Incorrect username or password']
          });
        });
    });
  }
));