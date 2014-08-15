'use strict';

define(['templates/templates', 'components/base', 'utils/utils'], function(templates, Base, utils) {

  var tabs = {};

  tabs.init = function(aView) {
    var f             = Object.create(new Base());
    f.view            = aView;
    f.initLinks       = initLinks;
    f.addTabsListener = addTabsListener;
    f.initContext     = initContext;
    f.initLinks();
    f.initContext();
    return f;
  };

  function initLinks() {
    this.addTabsListener();
  }

  function initContext() {
    var activeLink    = this.view.querySelector('a.js-active');
    var contentId     = activeLink.getAttribute('data-content-id');
    var contents      = this.view.querySelectorAll('.js-tabs-content');
    var content       = contents[contentId];
    content.innerHTML = templates[activeLink.getAttribute('data-runtime-template')]();
    garhammar.initComponents(content);
  }

  function addTabsListener() {
    var self      = this;
    var tabLinks  = this.view.querySelectorAll('.js-tabs-link');
    var contents  = this.view.querySelectorAll('.js-tabs-content');
    utils.each(tabLinks, function(link) {
      link.addEventListener('click', function(ev) {
        var contentId;
        garhammar.removeListeners('resize');
        ev.preventDefault();
        utils.each(contents, function(content) {
          content.classList.add('hide');
        });
        utils.each(tabLinks, function(link) {
          var icon;
          link.classList.remove('active');
          link.classList.remove('js-active');
          icon = link.querySelector('span');
          if (icon) {
            icon.classList.remove('icon-arrow-up');
            icon.classList.add('icon-arrow-down');
          }
        });
        contentId = parseInt(this.getAttribute('data-content-id'), 10);
        utils.each(self.view.querySelectorAll('.js-tabs-link[data-content-id="' + contentId + '"]'), function(link) {
          var icon;
          link.classList.add('active');
          link.classList.add('js-active');
          icon = link.querySelector('span');
          if (icon) {
            icon.classList.remove('icon-arrow-down');
            icon.classList.add('icon-arrow-up');
          }    
        });
        contents[contentId].classList.remove('hide');
        self.initContext();
      });
    });
    return;
  }

  return tabs;
});