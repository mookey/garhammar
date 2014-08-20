'use strict';

define([templatesName, 'components/base', 'utils/utils'], function(templates, Base, utils) {

  var tabs = {};

  tabs.init = function(aView) {
    var f             = Object.create(new Base());
    f.view            = aView;
    f.addTabsListener = addTabsListener;
    f.initContext     = initContext;
    f.onEvent         = onEvent;
    f.addTabsListener();
    f.initContext();
    garhammar.registerListener('resize', 'tabs');
    return f;
  };

  function initLinks() {
    this.addTabsListener();
  }

  function onEvent(eventName) {
    var link;
    var contentId;
    var style = window.getComputedStyle(this.view.querySelector('.js-tabs-large'));
    if (style.getPropertyValue('display') === 'none') {
      return;
    }
    if (this.view.querySelector('.js-active')) {
      return;
    }
    link = this.view.querySelector('.js-tabs-link');
    contentId = parseInt(link.getAttribute('data-content-id'), 10);
    utils.each(this.view.querySelectorAll('.js-tabs-link[data-content-id="' + contentId + '"]'), function(link) {
      link.classList.add('active');
      link.classList.add('js-active');
    });
    this.view.querySelectorAll('.js-tabs-content')[contentId].classList.remove('hide');
  }

  function initContext() {
    var activeLink      = this.view.querySelector('a.js-active');
    var runtimeTemplate = activeLink.getAttribute('data-runtime-template');
    if (!runtimeTemplate) {
      return;
    }
    var contentId       = activeLink.getAttribute('data-content-id');
    var contents        = this.view.querySelectorAll('.js-tabs-content');
    var content         = contents[contentId];
    content.innerHTML   = templates[runtimeTemplate]();
    garhammar.initComponents(content);
  }

  function addTabsListener() {
    var self      = this;
    var tabLinks  = this.view.querySelectorAll('.js-tabs-link');
    var contents  = this.view.querySelectorAll('.js-tabs-content');
    utils.each(tabLinks, function(link) {
      link.addEventListener('click', function(ev) {

        var contentId;
        ev.preventDefault();
        utils.each(contents, function(content) {
          content.classList.add('hide');
        });

        if (this.parentNode.classList.contains('js-tabs-wrapper') && this.classList.contains('js-active')) {
          utils.each(tabLinks, function(link) {
            link.classList.remove('active');
            link.classList.remove('js-active');
          });
          return; 
        }

        utils.each(tabLinks, function(link) {
          link.classList.remove('active');
          link.classList.remove('js-active');
        });

        contentId = parseInt(this.getAttribute('data-content-id'), 10);
        utils.each(self.view.querySelectorAll('.js-tabs-link[data-content-id="' + contentId + '"]'), function(link) {
          link.classList.add('active');
          link.classList.add('js-active');
        });
        contents[contentId].classList.remove('hide');
        self.initContext();
      });
    });
    return;
  }

  return tabs;
});