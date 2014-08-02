'use strict';

define(['utils/utils'], function(utils) {

  var Base = function() {

    this.getName = function() {
      return {
        name  : this.view.getAttribute('data-component'),
        id    : this.view.getAttribute('data-id')
      };
    };

    this.clearErrors = function(context) {
      var c = context || this.view;
      utils.each(c.querySelectorAll('.js-error'), function(elem) {
        elem.classList.remove('error', 'js-error');
      });
      utils.each(c.querySelectorAll('.js-abs-error'), function(elem) {
        elem.parentNode.removeChild(elem);
      });
    };

    this.ajax = function(data, callback, type, url) {
      var oReq = new XMLHttpRequest();
      oReq.open(type, url , true);
      oReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      oReq.onload = function(ev) {
        callback(this);
      };
      oReq.send(data);
    };

    this.addFormEventListeners = function() {
      var form = this.view.querySelector('form'),
          self = this;
      if (!form) {
        return;
      }
      form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        self.ajax(new FormData(form), function(data) {self.callback(data);}, form.method, form.action);
      });
      utils.each(self.view.querySelectorAll('input, textarea'), function(input) {
        input.addEventListener('focus', function(ev) {
          self.clearErrors(this.parentNode);
        });
      });
    };

    this.callback = function(data) {
      var div = document.createElement('div'),
          response = (typeof data.responseText === 'string') ? JSON.parse(data.responseText) : data;
      div.innerHTML = this.template(response);
      this.view.innerHTML = div.firstChild.innerHTML;
      this.addFormEventListeners();
      garhammar.initComponents(this.view);
    };

  };

  return Base;

});