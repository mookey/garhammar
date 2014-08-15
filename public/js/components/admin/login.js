'use strict';

define(['templates/admin_templates', 'components/base'], function(templates, Base) {
  
  var login = {};

  login.init = function(aView) {
    var c       = Object.create(new Base());
    c.protoCb   = c.callback;
    c.callback  = callback;
    c.view      = aView;
    c.template  = templates[c.view.getAttribute('data-template')];
    c.addFormEventListeners();
    return c;
  };

  function callback(data) {
    if (data.status === 200) {
      window.location.href = '/admin/users';
      return;
    }
    this.protoCb(data);
  }

  return login;
});