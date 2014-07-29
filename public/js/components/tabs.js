define(['templates/templates', 'components/base', 'utils/utils'], function(templates, Base, utils) {
  
  var tabs = {};
  var SIZE_MEDIUM = 768;

  tabs.init = function(aView) {
    var f = Object.create(new Base());
    f.view = aView;
    f.initLinks = initLinks;
    f.initContext = initContext;
    f.onEvent = onEvent;
    f.initLinks();
    garhammar.registerListener('resize', 'tabs');
    return f;
  };

  function onEvent(eventName) {
    this.initLinks();
  }

  function initLinks() {
    var self = this;
    var tabLinks;
    var tabs;
    if (isViewportSmall()) {
      tabs = this.view.querySelector('.js-tabs-small');
    } else {
      tabs = this.view.querySelector('.js-tabs-large');
    }
    if (tabs.classList.contains('js-initialized')) {
      return;
    }
    tabs.classList.add('js-initialized');
    tabLinks = tabs.querySelectorAll('.js-tabs-link');

    utils.each(tabLinks, function(link) {
      addTabsListener.apply(self, [link, tabLinks]);
    });
    utils.each(tabLinks, function(link) {
      self.initContext(link);
    });
  }

  function initContext(link) {
    var content;
    var template;
    var wrapper;
    if (!link.classList.contains('js-active')) {
      return;
    }
    if (isViewportSmall()) {
      wrapper = utils.findParentBySelector(link, '.js-tabs-wrapper');
      content = wrapper.querySelector('.js-tabs-content');
    } else {
      content = this.view.querySelector('.js-tabs-large .js-tabs-content');
    }
    template = link.getAttribute('data-runtime-template');
    if (!template) {
      return;
    }
    content.innerHTML = templates[link.getAttribute('data-runtime-template')]();
    garhammar.initComponents(content);
  }

  function isViewportSmall() {
    return (Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) < SIZE_MEDIUM;
  }

  function addTabsListener(link, tabLinks) {
    var self = this;
    link.addEventListener('click', function(ev) {
      var wrapper;
      var content;
      var icon;
      var size;
      ev.preventDefault();
      wrapper   = utils.findParentBySelector(this, '.js-tabs-wrapper');
      content   = wrapper.querySelector('.js-tabs-content');

      if (!isViewportSmall()) {
        utils.each(wrapper.querySelectorAll('.js-tabs-link'), function(link) {
          link.classList.remove('active');
          link.classList.remove('js-active');
        });
        content.classList.remove('hide');
        this.classList.add('js-active');
        this.classList.add('active');
        self.initContext(this);
        return;
      }

      icon = link.querySelector('.icon');
      if (link.classList.contains('js-active')) {
        content.classList.add('hide');
        icon.classList.add('icon-arrow-down');
        icon.classList.remove('icon-arrow-up');
        this.classList.remove('js-active');
        this.classList.remove('active');
        return;
      } 
      content.classList.remove('hide');
      icon.classList.remove('icon-arrow-down');
      icon.classList.add('icon-arrow-up');
      this.classList.add('js-active');
      this.classList.add('active');
      self.initContext(this);
    });
  }

  return tabs;
});