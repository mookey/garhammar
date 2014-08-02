'use strict';

define(['templates/templates', 'components/base'], function(templates, Base) {
  
  var login = {};

  login.init = function(aView) {
    var c       = Object.create(new Base());
    c.view      = aView;
    c.template  = templates[c.view.getAttribute('data-template')];
    c.addFormEventListeners();
    return c;
  };

  return login;
});