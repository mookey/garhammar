'use strict';

var pics    = {},
    rules   = require('../utils/rule.js'),
    helper  = require('../utils/object_helper.js'),
    db      = require('monk')('localhost/garhammar'),
    moment  = require('moment');

pics.collection = db.get('pics');
pics.collection.index('filename', { unique: true });

pics.rules = [];
pics.rules.push(rules.create({
  name  : 'filename',
  type  : 'string',
  min   : [2, 'The pictures filename must be at least two charcters.'],
  max   : [255, 'The pictures filename must not be more than 255 charcters.']
}));



pics.create = function(pic) {
  var u    = {},
      self = this;

  u.name          = pic.name;
  u.filename      = pic.filename;
  u.ext           = pic.ext;
  u.vertical      = pic.vertical;
  u.created       = new Date();
  u.created_human = moment(u.created).format('HH:mm | D MMM YYYY');
  u.updated       = u.created;
  u.updated_human = u.created_human;
  u.dateTaken     = pic.dateTaken;
  u.taken_human   = moment(u.dateTaken).format('HH:mm | D MMM YYYY');
  u.desc          = pic.desc;
  u.tags          = pic.tags;
  u.xs            = pic.xs;
  u.s             = pic.s;
  u.m             = pic.m;
  u.l             = pic.l;
  u.xl            = pic.xl;

  u.save = function(cb) {
    self.collection.insert(u, cb);
  };

  u.validate = function(confirm_password) {
    var errors = helper.validate.call(self, u);
    return errors;
  };

  return u;
};

pics.update = function(pic, cb) {
  var updated       = new Date(),
      updated_human = moment(updated).format('HH:mm | D MMM YYYY');

  this.collection.findAndModify(
    { _id: pic._id },
    { $set: {
        name          : pic.name,
        dateTaken         : pic.dateTaken,
        dateTaken_human   : moment(pic.dateTaken).format('HH:mm | D MMM YYYY'),
        desc          : pic.desc,
        updated       : updated,
        updated_human : updated_human
      }
    },
    cb
  );
};

pics.addTag = function(id, tag, cb) {
  this.collection.findAndModify(
    { _id: id },
    { $push: { tags: tag } },
    { new : true },
    cb
  );
};

pics.removeTag = function(id, tag, cb) {
  this.collection.findAndModify(
    { _id: id },
    { $pull: { tags: tag } },
    { new : true },
    cb
  );
};

pics.getSome = function(skip, limit, cb) {
  var self = this;
  self.collection.find(
    {},
    { limit : limit, skip: skip, sort : { created : -1 } },
    function(err, docs) {
      if (err) {
        throw err;
      }
      cb({
        pics  : docs,
        skip  : skip,
        limit : limit
      });
  });
};

module.exports = pics;