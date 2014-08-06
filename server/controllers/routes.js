'use strict';

var pics        = require('../models/pics');

module.exports = function(app) {

  var dimensions = {
    XS  : 200,
    S   : 320,
    M   : 640,
    L   : 840,
    XL  : 1080
  };

  app.get('/', function (req, res) {
    req.locals.template = '_blog';
    r(req, res);
  });

  app.get('/me', function (req, res) {
    req.locals.template = '_me';
    r(req, res);
  });

  function getPicDimensions(w, pic) {

    if (w < dimensions.S) {
      return { 
        width: pic.xs.width,
        height: pic.xs.height
      };
    }
    if (w < dimensions.M) {
      return { 
        width: pic.s.width,
        height: pic.s.height
      };
    }
    if (w < dimensions.L) {
      return { 
        width: pic.m.width,
        height: pic.m.height
      };
    }
    if (w < dimensions.XL) {
      return { 
        width: pic.l.width,
        height: pic.l.height
      };
    }
    return { 
      width: pic.xl.width,
      height: pic.xl.height
    };
  }

  function getSuffix(w, dpr) {
    if (w > dimensions.XL) {
      return 'xl';
    }
    if (w > dimensions.L) {
      return (dpr > 1 ? 'xl' : 'l');
    }
    if (w > dimensions.M) {
      if (dpr >= 2) {
        return 'xl';
      }
      if (dpr >= 1.5) {
        return 'l';
      }
      return 'm';
    }
    if (w > dimensions.S) {
      if (dpr >= 3) {
        return 'xl';
      }
      if (dpr >= 2) {
        return 'l';
      }
      if (dpr >= 1.5) {
        return 'm';
      }
      return 's';
    }
    if (w > dimensions.XS) {
      if (dpr >= 3) {
        return 'm';
      }
      if (dpr >= 2) {
        return 's';
      }
      return 'xs';
    }
    return 'xs';
  }

  app.get('/pics', function (req, res) {
    var dpr;
    var width;
    var dimensions;
    var suffix;
    var rotate;
    var pictures = [];

    req.locals.template = '_pics';

    if (req.xhr) {
      dpr = req.param('dpr');
      width = req.param('containerWidth');
      suffix = getSuffix(width, dpr);

      pics.getSome(0, 20, function(data) {
        data.pics.forEach(function(pic) {
          dimensions = getPicDimensions(width, pic);
          rotate = Math.floor(Math.random()*2) + 1;
          rotate *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

          pictures.push({
            filename  : pic.filename + '-' + suffix + '.' + pic.ext,
            name      : pic.name,
            vertical  : pic.vertical,
            desc      : pic.desc,
            tags      : pic.tags,
            width     : dimensions.width,
            height    : dimensions.height,
            rotate    : rotate
          });
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