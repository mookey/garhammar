'use strict';

define([templatesName, 'utils/utils', 'components/base', 'smoothScroll'], function(templates, utils, Base, smoothScroll) {

  var form = {};

  form.init = function(aView) {
    var f = Object.create(new Base());
    f.view = aView;
    f.addEventListeners = addEventListeners;
    f.callback = callback;
    f.addEventListeners();
    return f;
  };

  function addEventListeners() {
    var self = this,
        main = document.getElementById('main');

    utils.each(this.view.querySelectorAll('a'), function(link) {
      link.addEventListener('click', function(ev) {
        var link = this;
        garhammar.removeAllListeners('resize');
        garhammar.removeAllListeners('load');
        garhammar.removeAllListeners('scroll');

        if (link.href.indexOf('logout') > -1) {
          return;
        }
        ev.preventDefault();
        utils.each(self.view.querySelectorAll('a'), function(elem) {
          elem.parentNode.classList.remove('active');
        });
        link.parentNode.classList.add('active');
        if (window.history.pushState) {
          window.history.pushState({}, '', link.href);
        }
        self.ajax({xhr: true}, function(data) {self.callback(data);}, 'get', link.href);
      });

    });
  }

  function callback(data) {
    var div = document.createElement('div'),
        response = JSON.parse(data.responseText),
        target;
    try {
      div.innerHTML = templates[response.template](response);
    } catch(e) {
      console.error('No template of type \'' + response.template + '\'', e);
    }
    target = document.getElementById('main');
    target.innerHTML = div.innerHTML;
    garhammar.initComponents(target);
    smoothScroll.animateScroll(null, '#main');
  }


  return form;

});