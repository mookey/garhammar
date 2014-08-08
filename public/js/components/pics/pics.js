'use strict';

define(['templates/templates', 'utils/utils'], function(templates, utils) {
  
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
    c.getPictures = getPictures;
    c.addOverviewListener = addOverviewListener;
    c.getPictures();
    c.addOverviewListener();
    garhammar.registerListener('scroll', 'pics/pics');
    return c;
  };

  function addOverviewListener() {
    var self = this;
    utils.each(this.view.querySelectorAll('input'), function(item) {
      item.addEventListener('change', function() {
        self.getPictures(false);
      });
    });
  }

  function getPictures(shouldAppend) {
    var self = this;
    var isOverview = !self.view.querySelector('input[name="gallery"]').checked;
    var pictureElem = this.view.querySelector('.js-pics');
    var append = shouldAppend || false;
    var images = pictureElem.querySelectorAll('img');
    var skip = 0;
    if (append && images.length) {
      l(images)
      skip = parseInt(images[images.length - 1].getAttribute('data-no'), 10) + 1;
    }

    if (isOverview) {
      pictureElem.classList.add('overview');
    } else {
      pictureElem.classList.remove('overview');
    }

    self.ajax({}, function(data) { self.callback(data, append); }, 'get',
      '/pics' + 
      '?dpr=' + window.devicePixelRatio + 
      '&width=' + self.view.offsetWidth +
      '&gallery=' + !isOverview +
      '&skip=' + skip
    );
  }

  function callback(data, shouldAppend) {
    var pictures = JSON.parse(data.responseText);
    var pictureElem = this.view.querySelector('.js-pics');
    var inner;

    if (!shouldAppend) {
      pictureElem.innerHTML = this.template(pictures);
    } else {
      inner = pictureElem.innerHTML;
      inner += this.template(pictures);
      pictureElem.innerHTML = inner;
    }
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
      action(elem, height);
    }
    if (!len) {
      this.getPictures(true);
    }
  }

  function action(elem, height) {
    if (!inView(elem, height)) {
      return;
    }
    elem.src = elem.getAttribute('data-echo');
    elem.removeAttribute('data-echo');
    elem.classList.remove('spinner');
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