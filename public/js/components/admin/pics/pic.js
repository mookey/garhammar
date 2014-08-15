'use strict';

define(['templates/admin_templates', 'components/base', 'utils/utils'], function(templates, Base, utils) {
  
  var pic = {};

  pic.init = function(aView) {
    var f = Object.create(new Base());
    f.view = aView;
    f.template = templates[f.view.getAttribute('data-template')];
    l('ciew', f.view);
    l('template', f.template);
    f.addFormEventListeners();
    return f;
  };

  return pic;
});