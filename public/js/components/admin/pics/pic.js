'use strict';

define(['templates/admin_templates', 'components/base', 'libs/pikaday/pikaday', 'utils/utils'], function(templates, Base, Pikaday, utils) {
  
  var pic = {};

  pic.init = function(aView) {
    var f = Object.create(new Base());
    var picker;
    f.view = aView;
    f.template = templates[f.view.getAttribute('data-template')];
    utils.each(f.view.querySelectorAll('.js-datepicker'), function(elem, i) {
      picker = new Pikaday({ 
        field: elem
      });
    });
    f.callback    = callback;
    f.addTag      = addTag;
    f.removeTags  = removeTags;
    f.removeTag   = removeTag;
    f.addFormEventListeners();
    f.addTag();
    f.removeTags();
    return f;
  };

  function addTag() {
    var self = this;
    this.view.querySelector('.js-add-tag').addEventListener('click', function(ev) {
      ev.preventDefault();
      var tagElem = self.view.querySelector('.js-add-tag-input');
      if (!tagElem.value) {
        return;
      }
      self.ajax(
        JSON.stringify({tag : tagElem.value}),
        function(data) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="tag right-10">' + tagElem.value + '</span><a href="/admin/pic/' + JSON.parse(data.responseText)._id + '/removeTag" class="icon icon-minus js-remove-tag"></a>';
          tagElem.value = '';
          self.view.querySelector('.js-tags').appendChild(li);
          self.removeTag(li.querySelector('a'));
        },
        'post',
        this.href,
        {
          key : 'Content-Type',
          value : 'application/json;charset=UTF-8'
        }
      );
    });
  }

  function removeTags() {
    var self = this;
    utils.each(this.view.querySelectorAll('.js-remove-tag'), function(elem) {
      self.removeTag(elem);
    });
  }

  function removeTag(elem) {
    var self = this;
    elem.addEventListener('click', function(ev) {
      ev.preventDefault();
      var link = this;
      var prev = utils.getPreviousSibling(this);
      self.ajax(
        JSON.stringify({tag : prev.innerHTML}),
        function(data) {
          utils.removeNode(link.parentNode);
        },
        'post',
        this.href,
        {
          key : 'Content-Type',
          value : 'application/json;charset=UTF-8'
        }
      );
    });
  }

  function callback(data) {
      var div = document.createElement('div'),
          response = (typeof data.responseText === 'string') ? JSON.parse(data.responseText) : data;
      var imgElem;
      div.innerHTML = this.template(response);
      this.view.innerHTML = utils.getFirstChild(div).innerHTML;
      this.addFormEventListeners();
      garhammar.initComponents(this.view);
      new Pikaday({ 
        field: this.view.querySelector('.js-datepicker')
      });
      imgElem = this.view.querySelector('img');
      imgElem.classList.remove('spinner');
      imgElem.src = imgElem.getAttribute('data-echo');
      imgElem.removeAttribute('data-echo');
  }

  return pic;
});