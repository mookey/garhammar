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
    garhammar.registerListener('resize', 'tabs', aView.getAttribute("data-id"));
    return f;
  };

  function initLinks() {
    this.addTabsListener();
  }

  function onEvent(eventName) {
    var contentId;
    var style;
    if (this.view.querySelector('.js-tabs-link.js-active')) {
      return;
    }
    style = window.getComputedStyle(this.view.querySelector('.js-tabs-large'));
    if (style.getPropertyValue('display') === 'none') {
      return;
    }
    this.view.querySelector('.js-tabs-link').click();
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
    utils.each(tabLinks, function(link) {
      link.addEventListener('click', function(ev) {

        var isActive  = this.classList.contains('js-active');
        var isSmall   = this.parentNode.classList.contains('js-tabs-wrapper');
        var contentId;
        var previouslyActiveLinks;
        var previouslyActiveContentId;
        var previouslyActiveContent;

        ev.preventDefault();

        if (isActive && !isSmall) {
          return;
        }

        previouslyActiveLinks     = self.view.querySelectorAll('.js-active');
        if (previouslyActiveLinks.length) {
          previouslyActiveContentId = previouslyActiveLinks[0].getAttribute('data-content-id');
          previouslyActiveContent   = self.view.querySelector('.js-tabs-content[data-content-id="' + previouslyActiveContentId + '"]');

          utils.each(previouslyActiveContent.querySelectorAll('.js-component'), function(c, i) {
            garhammar.removeAllListenersForComponent(c.getAttribute('data-component'));
          });
          previouslyActiveContent.classList.add('hide');

          utils.each(previouslyActiveLinks, function(link) {
            link.classList.remove('active');
            link.classList.remove('js-active');
          });

          if (isActive && isSmall) {
            return;
          }
        }

        contentId = this.getAttribute('data-content-id');
        utils.each(self.view.querySelectorAll('.js-tabs-link[data-content-id="' + contentId + '"]'), function(link) {
          link.classList.add('active');
          link.classList.add('js-active');
        });
        self.view.querySelector('.js-tabs-content[data-content-id="' + contentId + '"]').classList.remove('hide');
        self.initContext();
      });
    });
    return;
  }

  return tabs;
});