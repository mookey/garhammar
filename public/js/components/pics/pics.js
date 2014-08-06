'use strict';

define(['templates/templates'], function(templates) {
  
  var pics = {};

  pics.init = function(aView) {
    var c       = {};
    c.view      = aView;
    c.template  = templates[c.view.getAttribute('data-template')];
    c.debounce  = debounce;
    c.render    = render;
    c.detach    = detach;
    c.onEvent   = onEvent;
    c.ajax      = ajax;
    c.callback  = callback;
    c.ajax({}, function(data) { c.callback(data); }, 'get', '/pics?dpr=' + window.devicePixelRatio + '&containerWidth=' + c.view.offsetWidth);
    return c;
  };

  function callback(data) {
    var pictures = JSON.parse(data.responseText);
    this.view.innerHTML = this.template(pictures);
    garhammar.registerListener('scroll', 'pics/pics');
    garhammar.registerListener('load', 'pics/pics');
    this.render();
  }

  function ajax(data, callback, type, url) {
    var oReq = new XMLHttpRequest();
    oReq.open(type, url , true);
    oReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    oReq.onload = function(ev) {
      callback(this);
    };
    oReq.send();
  }

  function onEvent(eventName) {
    this.debounce();
  }

  function debounce() {
    var self = this;
    clearTimeout(self.timer);
    self.timer = setTimeout(self.render(), 250);
  }

  function render() {
    var nodes   = this.view.querySelectorAll('img[data-echo]');
    var len     = nodes.length;
    var height  = (window.innerHeight || document.documentElement.clientHeight);
    var i       = 0;
    var elem;

    for (; i < len; i++) {
      elem = nodes[i];
      if (inView(elem, height)) {
        elem.src = elem.getAttribute('data-echo');
        elem.removeAttribute('data-echo');
        elem.classList.remove('spinner');
      } 
    }
    if (!len) {
      this.detach();
    }
  }

  function detach() {
    l('detach');
    garhammar.removeListeners('scroll');
    clearTimeout(this.timer);
  }

  function inView(el, height) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <= height
    );
  }

  return pics;
});