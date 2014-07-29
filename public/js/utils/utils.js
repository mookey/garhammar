define([], function() {
  'use strict';
  var utils = {};

  utils.insertAfter = function(newElement, targetElement) {
    var parent = targetElement.parentNode;

    if(parent.lastchild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };

  utils.getFirstChild = function(el) {
    var firstChild = el.firstChild;
    while(firstChild != null && firstChild.nodeType == 3){ // skip TextNodes
      firstChild = firstChild.nextSibling;
    }
    return firstChild;
  }

  utils.each = function(elems, callback) {
    var i   = 0,
        len = elems.length;

    for (; i < len; i++) {
      callback(elems[i], i);
    }
  };

  function collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
  }

  utils.findParentBySelector = function(elm, selector) {
      var all = document.querySelectorAll(selector),
          cur = elm.parentNode;
      while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
          cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
  };

  utils.highlight = function(elem) {
    elem.classList.add('highlight');
    setTimeout(function() {
      elem.classList.remove('highlight');
    }, 500);
  };

  return utils;
});