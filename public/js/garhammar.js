'use strict';

function l(a, b, c) {
  if (c) {
    console.log(a, b, c);
    return;
  }
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

garhammar.registerListener = function(eventType, listenerName, listenerId) {
  if (!this.listeners[eventType]) {
    this.listeners[eventType] = [];
    window.addEventListener(eventType, garhammar.triggeredEvent);
  }
  this.listeners[eventType].push({
    componentName : listenerName,
    componentId   : listenerId
  });
};

garhammar.removeAllListeners = function(eventType) {
  delete this.listeners[eventType];
  window.removeEventListener(eventType, garhammar.triggeredEvent);
};

garhammar.removeAllListenersForComponent = function(componentName, componentId) {
  var i;
  var len;
  var prop;
  var listeners;
  for (prop in this.listeners) {
    i = 0;
    listeners = this.listeners[prop];
    len = listeners.length;
    for (; i < len; i++) {
      if (componentName !== listeners[i].componentName) {
        continue;
      }
      if (!componentId) {
        listeners.splice(i, 1);
        if (listeners.length === 0) {
          window.removeEventListener(prop, garhammar.triggeredEvent);
        }
        return;
      }
      if (componentId !== listeners[i].id) {
        continue;
      }
      listeners.splice(i, 1);
      if (listeners.length === 0) {
        window.removeEventListener(prop, garhammar.triggeredEvent);
      }
    }
  }
};

garhammar.removeListener = function(eventType, componentName, id) {
  var i;
  var len;
  var listeners;
  i = 0;
  listeners = this.listeners[eventType];
  if (!listeners) {
    return;
  }
  len = listeners.length;
  for (; i < len; i++) {
    if (listeners.componentName !== 'componentName') {
      continue;
    }
    if (!id) {
      listeners.splice(i, 1);
      return;
    }
    if (listeners.componentId !== id) {
      continue;
    }
    listeners.splice(i, 1);
  }


  delete this.listeners[eventType];
  window.removeEventListener(eventType, garhammar.triggeredEvent);
};

garhammar.componentsEventDispatcher = function(eventType) {
  var i;
  var len;
  var listener;
  var c;
  i = 0;
  len = garhammar.listeners[eventType] ? garhammar.listeners[eventType].length : 0;
  for (; i < len; i++) {
    listener = garhammar.listeners[eventType][i];
    c = garhammar.components.get(listener.componentName, listener.componentId);
    c.onEvent(eventType);
  }
};

garhammar.components.get = function(componentName, componentId) {
  if (componentId) {
    return this[componentName][componentId];
  }
  return this[componentName];
};


garhammar.addTooltipListener = function(utils, component) {
    component.addEventListener('click', function(ev) {
      ev.preventDefault();
      var tooltipId   = component.getAttribute('data-tooltip-id');
      var wrapper     = utils.findParentBySelector(this, '.js-tooltip-wrapper');
      var tooltipElem = wrapper.querySelector('.js-abs-tooltip[data-tooltip-id="' + tooltipId + '"]');
      var arrowElem   = tooltipElem.querySelector('svg');
      var tooltipHalfWidth    = 110;
      var tooltipLeftOffset   = 12;
      var tooltipBottomOffset = 3;
      var arrowRightOffset    = 85;
      var isWithinContainer   = true;
      var diff;
      var style;
      var wrapperRect;
      var elemRect;
      var bottomOffset;
      var leftOffset;
      wrapper.classList.add('dim');

      wrapperRect   = wrapper.getBoundingClientRect();
      elemRect      = component.getBoundingClientRect();
      bottomOffset  = wrapperRect.bottom - elemRect.bottom;
      leftOffset    = elemRect.left - wrapperRect.left - tooltipHalfWidth + tooltipLeftOffset;

      if ((leftOffset + (2 * tooltipHalfWidth)) > wrapperRect.right) {
        diff        = leftOffset + (2 * tooltipHalfWidth) - wrapperRect.width;
        leftOffset  = leftOffset - diff;
        style       = window.getComputedStyle(arrowElem);
        arrowElem.style.right = arrowRightOffset - diff + 'px';
        isWithinContainer = false;
      }

      if (leftOffset < 0) {
        diff        = Math.abs(leftOffset);
        leftOffset  = leftOffset + diff;
        style       = window.getComputedStyle(arrowElem);
        arrowElem.style.right = arrowRightOffset + diff + 'px';
        isWithinContainer = false;
      }

      if (isWithinContainer) {
        arrowElem.style.right = arrowRightOffset + 'px';
      }

      tooltipElem.style.bottom = (bottomOffset + tooltipBottomOffset) + 'px';
      tooltipElem.style.left = leftOffset + 'px';
      tooltipElem.classList.add('js-initialized');
      tooltipElem.classList.remove('hide');
    });
};

garhammar.initComponents = function(ctx) {

  var scope = ctx || document;

  require(['utils/utils'], function(utils) {
    utils.each(scope.querySelectorAll('.js-component'), requireComponent);
    utils.each(scope.querySelectorAll('.js-close'), function(elem) { addCloseListener(utils, elem); });
    utils.each(scope.querySelectorAll('.js-tooltip-icon'), function(elem) { garhammar.addTooltipListener(utils, elem); });
  });

  function addCloseListener(utils, component) {
    component.addEventListener('click', function(ev) {
      ev.preventDefault();
      var closeWrapper = utils.findParentBySelector(this, '.js-close-wrapper');
      closeWrapper.classList.add('hide');
      if (closeWrapper.classList.contains('js-abs-tooltip')) {
        utils.findParentBySelector(closeWrapper, '.js-tooltip-wrapper').classList.remove('dim');
      }
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
