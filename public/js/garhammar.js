'use strict';

function l(a, b) {
  if (b) {
    console.log(a, b);
    return;
  }
  console.log(a);
}

var garhammar = garhammar || {};
garhammar.listeners = garhammar.listeners || {};
garhammar.components = garhammar.components || {};


garhammar.triggeredEvent = function(ev) {
  garhammar.componentsEventDispatcher(ev.type);
};

garhammar.registerListener = function(eventName, listenerName, listenerId) {
  if (!this.listeners[eventName]) {
    this.listeners[eventName] = [];
    window.addEventListener(eventName, garhammar.triggeredEvent);
  }
  this.listeners[eventName].push({
    componentName : listenerName,
    componentId   : listenerId
  });
};

garhammar.removeListeners = function(eventName) {
  delete this.listeners[eventName];
  window.removeEventListener(eventName, garhammar.triggeredEvent);
};

garhammar.componentsEventDispatcher = function(eventName) {
  var i;
  var len;
  var listener;
  var c;
  i = 0;
  len = garhammar.listeners[eventName] ? garhammar.listeners[eventName].length : 0;
  for (; i < len; i++) {
    listener = garhammar.listeners[eventName][i];
    c = garhammar.components.get(listener.componentName, listener.componentId);
    c.onEvent(eventName);
  }
};

garhammar.components.get = function(componentName, componentId) {
  if (componentId) {
    return this[componentName][componentId];
  }
  return this[componentName];
};

garhammar.initComponents = function(ctx) {

  var scope = ctx || document;

  require(['utils/utils'], function(utils) {
    utils.each(scope.querySelectorAll('.js-component'), requireComponent);
    utils.each(scope.querySelectorAll('.js-close'), function(elem) { addCloseListener(utils, elem); });
  });

  function addCloseListener(utils, component) {
    component.addEventListener('click', function(ev) {
      ev.preventDefault();
      var wrapper = utils.findParentBySelector(this, '.js-close-wrapper');
      wrapper.classList.add('hide');
    });
  }

    // components = [];
    // components = scope.querySelectorAll('.js-close');
    // len = components.length;
    // i = 0;
    // for (; i < len; i++) {
    //   addCloseListener(utils, components[i]);
    // }

  // var scope       = ctx || document,
  //     components  = scope.querySelectorAll('.js-component'),
  //     i           = 0,
  //     len         = components.length,
  //     wrapper,
  //     icon,
  //     content;

  // for (; i < len; i++) {
  //   requireComponent(components[i]);
  // }

  // components = [];
  // components = scope.querySelectorAll('.js-read-more-link');
  // len = components.length;
  // i = 0;

  // require(['components/utils'], function(utils) {
  //   for (; i < len; i++) {
  //     addReadMoreListener(utils, components[i]);
  //   }
  //   components = [];
  //   components = scope.querySelectorAll('.js-close');
  //   len = components.length;
  //   i = 0;
  //   for (; i < len; i++) {
  //     addCloseListener(utils, components[i]);
  //   }
  // });



  // function addReadMoreListener(utils, component) {
  //   component.addEventListener('click', function(ev) {
  //     ev.preventDefault();
  //     wrapper = utils.findParentBySelector(this, '.js-read-more-wrapper');
  //     content = wrapper.querySelector('.js-read-more-content');
  //     icon = utils.getFirstChild(this);
  //     if (content.classList.contains('hide')) {
  //       content.classList.remove('hide');
  //       icon.classList.remove('icon-arrow-down');
  //       icon.classList.add('icon-arrow-up');
  //       return;
  //     }
  //     icon.classList.remove('icon-arrow-up');
  //     icon.classList.add('icon-arrow-down');
  //     content.classList.add('hide');
  //   });
  // }


  function requireComponent(c) {
    var name = c.getAttribute('data-component'),
        id   = c.getAttribute('data-id');
    if (c.classList.contains('js-initialized')) {
      return;
    }
    require(['components/' + name], function(component) {

      if (!garhammar.components[name]) {
        garhammar.components[name] = {};
      }
      if (id) {
        garhammar.components[name][id] = component.init(c);
        return;
      }
      garhammar.components[name] = component.init(c);
      c.classList.add('js-initialized');
    });
  }
};



requirejs(
  ['libs/domReady/domReady', 'smoothScroll'],
  function (domReady, smoothScroll) {
    domReady(function () {
      garhammar.isAdmin = document.getElementById('main').classList.contains('admin');
      garhammar.initComponents();
      smoothScroll.init();
    });
  }
);

