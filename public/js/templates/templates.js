'use strict';

define(['templates/compiled_templates'], function () {

  var templates = {},
      key;

  for (key in Handlebars.templates) {
    templates[key] = Handlebars.templates[key];
    Handlebars.partials[key] = templates[key];
  }

  return templates;

});