'use strict';

var pics        = require('../models/pics');

module.exports = function(app) {

  var dimensions = {
    XS  : 280,
    S   : 440,
    M   : 600,
    L   : 920,
    XL  : 1040
  };

  app.get('/', function (req, res) {
    req.locals.template = '_blog';
    r(req, res);
  });

  app.get('/me', function (req, res) {
    req.locals.template = '_me';
    r(req, res);
  });

  function getPicDimensions(w, pic, dpr, isOverview) {

    if (isOverview) {
      return { 
        width   : pic.xs.width,
        height  : pic.xs.height,
        quality : dpr > 1 ? 's' : 'xs' 
      };
    }

    if (w < dimensions.S) {
      return { 
        width   : pic.xs.width,
        height  : pic.xs.height,
        quality : dpr > 1 ? 's' : 'xs' 
      };
    }
    if (w < dimensions.M) {
      return { 
        width   : pic.s.width,
        height  : pic.s.height,
        quality : dpr > 1 ? 'm' : 's' 
      };
    }
    if (w < dimensions.L) {
      return { 
        width   : pic.m.width,
        height  : pic.m.height,
        quality : dpr > 1 ? 'l' : 'm' 
      };
    }
    if (w < dimensions.XL) {
      return { 
        width   : pic.l.width,
        height  : pic.l.height,
        quality : dpr > 1 ? 'xl' : 'l' 
      };
    }
    return { 
        width   : pic.xl.width,
        height  : pic.xl.height,
        quality : 'xl' 
    };
  }

  app.get('/pics', function (req, res) {
    var dpr;
    var width;
    var isOverview;
    var dimensions;
    var i = 0;
    var pictures = [];

    req.locals.template = '_pics';

    if (req.xhr) {
      dpr = req.param('dpr');
      width = req.param('width');
      isOverview = req.param('gallery') !== 'true';

      pics.getSome(0, 20, function(data) {
        data.pics.forEach(function(pic) {
          dimensions = getPicDimensions(width, pic, dpr, isOverview);

          pictures.push({
            filename  : pic.filename + '-' + dimensions.quality + '.' + pic.ext,
            name      : pic.name,
            vertical  : pic.vertical,
            desc      : pic.desc,
            tags      : pic.tags,
            width     : dimensions.width,
            height    : dimensions.height,
            no        : i
          });
          i++;
        });
        req.locals.pictures = pictures;
        r(req, res);
      });
    } else {
      r(req, res);
    }
  });

  app.get('/styles', function (req, res) {
    req.locals.template = '_styles';
    req.locals.firstAlert = { 
      isError : false,
      message : 'Saved!'
    };
    req.locals.secondAlert = { 
      isError : true,
      message : 'Error!'
    };
    req.locals.tooltipError = {
      message : 'Email must be supplied'
    };
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