'use strict';

define([templatesName, 'components/base', 'utils/utils'], function(templates, Base, utils) {

  var tabs = {};

  tabs.init = function(aView) {
    var f             = Object.create(new Base());
    f.view            = aView;
    f.addTabsListener = addTabsListener;
    f.initContext     = initContext;
    f.addTabsListener();
    f.initContext();
    return f;
  };

  function initLinks() {
    this.addTabsListener();
  }


  function initContext() {
    var activeLink      = this.view.querySelector('a.js-active');
    var runtimeTemplate = activeLink.getAttribute('data-runtime-template');
    if (!runtimeTemplate) {
      return;
    }
    var contentId       = activeLink.getAttribute('data-content-id');
    var content        = this.view.querySelector('.js-tab-content[data-content-id="' + contentId + '"]');
    var sourceUrl       = activeLink.getAttribute('data-runtime-source');
    if (!sourceUrl) {
      content.innerHTML   = templates[runtimeTemplate]();
      garhammar.initComponents(content);
      return;
    }
    this.ajax(
      {},
      function(data) {
        content.innerHTML = templates[runtimeTemplate](JSON.parse(data.responseText));
        garhammar.initComponents(content);
      },
      'get',
      sourceUrl
    );
  }

  function addTabsListener() {
    var self      = this;
    var tabLinks  = this.view.querySelectorAll('.js-tab');

    utils.each(tabLinks, function(link) {
      link.addEventListener('click', function(ev) {

        var isActive  = this.classList.contains('js-active');
        var contentId;
        var previouslyActiveLinks;
        var previouslyActiveContentId;
        var previouslyActiveContent;

        ev.preventDefault();

        if (isActive) {
          return;
        }

        utils.each(tabLinks, function(tab) {
          previouslyActiveContentId = tab.getAttribute('data-content-id');
          previouslyActiveContent   = self.view.querySelector('.js-tab-content[data-content-id="' + previouslyActiveContentId + '"]');
          utils.each(previouslyActiveContent.querySelectorAll('.js-component'), function(c, i) {
            garhammar.removeAllListenersForComponent(c.getAttribute('data-component'));
          });
          tab.classList.remove('active');
          tab.classList.remove('js-active');
        });
        
        utils.each(self.view.querySelectorAll('.js-tab-content'), function(content) {
          content.classList.add('hide');
        });

        this.classList.add('active');
        this.classList.add('js-active');
        contentId = this.getAttribute('data-content-id');
        self.view.querySelector('.js-tab-content[data-content-id="' + contentId + '"]').classList.remove('hide');
        
        self.initContext();
      });
    });
    return;
  }

  return tabs;
});