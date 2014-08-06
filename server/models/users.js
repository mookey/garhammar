'use strict';

var users   = {},
    rules   = require('../utils/rule.js'),
    helper  = require('../utils/object_helper.js'),
    db      = require('monk')('localhost/garhammar'),
    bcrypt  = require('bcrypt'),
    moment  = require('moment');

users.collection = db.get('users');
users.collection.index('email', { unique: true });
users.collection.index('username', { unique: true });

users.rules = [];
users.rules.push(rules.create({
  name  : 'email',
  type  : 'string',
  min   : [7, 'En email-adress är alltid över sju tecken.'],
  max   : [255, 'Email-adressen får vara högst 255 tecken.'],
  pattern : [
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    'Email-adressen är felaktigt formaterad.'
    ]
}));
users.rules.push(rules.create({
  name  : 'password',
  type  : 'string',
  min   : [7, 'Lösenordet måste innehålla över sju tecken.'],
  max   : [255, 'Lösenordet får vara högst 255 tecken.']
}));

users.rules.push(rules.create({
  name  : 'username',
  type  : 'string',
  min   : [2, 'Användarnamnet måste innehålla över två tecken.'],
  max   : [20, 'Användarnamnet får vara högst 20 tecken.']
}));


users.create = function(user) {
  var u    = {},
      self = this;

  u.email         = user.email;
  u.username      = user.username;
  u.password      = user.password;
  u.permission    = user.permission ? user.permission : 0;
  u.created       = new Date();
  u.created_human = moment(u.created).format('HH:mm | D MMM YYYY');
  u.updated       = u.created;
  u.updated_human = u.created_human;

  u.save = function(cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(u.password, salt, function(err, hash) {
        if (err) throw err;
        u.password = hash;
        self.collection.insert(u, cb);
      });
    });
  };

  u.validate = function(confirm_password) {
    var errors = helper.validate.call(self, u);
    if (confirm_password !== u.password) {
      errors.confirm_password = { message : '\'Bekräfta lösenord\' överensstämmer inte med \'Lösenord\''};
    }
    return errors;
  };
  return u;
};

users.findByUsername = function(username, cb) {
  var self = this;
  this.collection.findOne({username : username}, cb);
};

// users.validatePassword = function(password, cb) {
//   bcrypt.compare(password, this.password, function(err, res) {
//     if (err) throw err;
//     return cb(res);
//   });
// };

module.exports = users;