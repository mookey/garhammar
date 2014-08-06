'use strict';

var rule  = {};

rule.create = function(param) {

  var r = {
    name : param.name,
    type : param.type,
    min  : [],
    max  : [],
    pattern : []
  };

  if (!param.name) {
    throw new Error('No name');
  }

  if (!param.type) {
    throw new Error('No type');
  }

  if (!param.min) {
    r.min[0] = 0;
    r.min[1] = '';
  } else if (!Array.isArray(param.min)) {
    throw new Error('Is not array');
  } else if ((typeof param.min[0] !== 'number') || (typeof param.min[1] !== 'string')) {
    throw new Error('Min bound must be of type Number and error of type String');
  } else {
    r.min = param.min;
  }


  if (!param.max) {
    r.max[0] = -1;
    r.max[1] = '';
  } else if (!Array.isArray(param.max)) {
    throw new Error('Is not array');
  } else if ((typeof param.max[0] !== 'number') || (typeof param.max[1] !== 'string')) {
    throw new Error('Max bound must be of type Number and error of type String');
  } else {
    r.max = param.max;
  }

  if (!param.pattern) {
    r.pattern[0] = -1;
    r.pattern[1] = '';
  } else if (!Array.isArray(param.pattern)) {
    throw new Error('Is not array');
  } else if ((typeof param.pattern[1] !== 'string')) {
    throw new Error('Pattern must be of type String and error of type String');
  } else {
    r.pattern = param.pattern;
  }

  r.validate = function(value) {

    var error = {};

    if (this.type !== typeof value) {
      throw new Error('Incorrect type');
    }

    if (this.type === 'string') {

      if (this.min[0] > value.length) {
        return {
          name : this.name,
          error : this.min[1]
        };
      }

      if (this.max[0] === -1) {
        return {};
      }

      if (this.max[0] < value.length) {
        return {
          name : this.name,
          error : this.max[1]
        };
      }

      if (this.pattern[0] !== -1) {
        if (!this.pattern[0].test(value)) {
          return {
            name : this.name,
            error : this.pattern[1]
          };
        }
      }

      return {};

    }

    if (this.type === 'number') {

      if (this.min[0] > value) {
        return {
          name : this.name,
          error : this.min[1]
        };
      }

      if (this.max[0] === -1) {
        return {};
      }

      if (this.max[0] < value) {
        return {
          name : this.name,
          error : this.max[1]
        };
      }

      return {};

    }
  };

  return r;
};


module.exports = rule;