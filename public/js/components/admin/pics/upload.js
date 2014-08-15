'use strict';

define(['templates/admin_templates', 'components/base'], function(templates, Base) {
  
  var upload = {};

  upload.init = function(aView) {
    var c       = Object.create(new Base());
    c.view      = aView;
    c.template  = templates[c.view.getAttribute('data-template')];
    c.addFormEventListeners();
    return c;
  };

  return upload;
});