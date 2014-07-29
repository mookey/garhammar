define(['templates/compiled_templates'], function () {
  'use strict';

  var templates = {},
      key;

  for (key in Handlebars.templates) {
    templates[key] = Handlebars.templates[key];
  }

  return templates;

});