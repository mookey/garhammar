'use strict';

var _      = require('underscore'),
    helper = {};

helper.validate = function(o) {
  var errors  = {},
      i       = 0,
      len     = this.rules.length,
      error,
      rule,
      value;

  for (; i < len; i++) {
    rule = this.rules[i];
    value = o[rule.name];
    error = rule.validate(value);
    if (!_.isEmpty(error)) {
      errors[error.name] = {
        message : error.error
      };
    }
  }

  return errors;
};

module.exports = helper;