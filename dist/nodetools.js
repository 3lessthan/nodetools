'use strict';

(function () {

  /**
   * Given an option set from a `nodeComponent` object property, will create a node
   * and append it to the DOM.
   * @param {Object} options - `nodeComponent` object
   */
  exports.appendNode = function (options) {
    // Test for existence of parent property
    if (options.hasOwnProperty('parent')) {
      // Test for existence of parent element
      var parent = document.getElementById(options.parent);
      if (parent) {
        if (options.hasOwnProperty('e')) {
          // Create node
          var node = document.createElement(options.e);
          // If text option exists, append it
          if (options.hasOwnProperty('text')) node.appendChild(document.createTextNode(options.text));

          // Loop through parameters and append them
          if (options.hasOwnProperty('params')) {
            var params = options.params;
            for (var key in params) {
              if (!params.hasOwnProperty(key)) continue;
              var param = document.createAttribute(key);
              if (options.params[key] !== null) param.value = options.params[key];
              node.setAttributeNode(param);
            }
            parent.appendChild(node);
            if (options.hasOwnProperty('html')) node.innerHTML = options.html;
            if (params.hasOwnProperty('id')) return document.getElementById(params.id);
          } else {
            // Else, append the node as is
            parent.appendChild(node);
            if (options.hasOwnProperty('html')) node.innerHTML = options.html;
          }
        }
        // If only text/html & parent is provided, append text to innerHTML
        else if (options.hasOwnProperty('text') || options.hasOwnProperty('html')) parent.innerHTML += options.text;else console.log('appendNode failed, invalid properties provided.');
      } else console.log('appendNode failed, invalid parent id:', options.parent);
    } else console.log('appendNode failed, no parent id provided.');
  };

  /**
   * Given a nodeComponent, will loop through each of the properties and append each to the DOM.
   * @param {Object} component - The nodeComponent to add to the DOM
   */
  exports.appendComponent = function (component) {
    for (var node in component) {
      if (!component.hasOwnProperty(node)) continue;
      if (Array.isArray(component[node])) for (var i = 0, n = component[node].length; i < n; i++) {
        this.appendNode(component[node][i]);
      } else this.appendNode(component[node]);
    }
  };

  /**
   * Removes all children of the passed element, or the element with the passed id.
   * If the `element` argument is a string, it must be the element's id.
   * @param {DOMElement|string} element The DOMElement node or id attribute of a DOM Element to remove all children from
   */
  exports.removeChildren = function (element) {
    element = typeof element === 'string' ? document.querySelector(element) : element;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  /**
   * Given an array of element ids, and optionally a pre/postfix string to append to the id list,
   * loops through the elements, removing all of each of their children.
   * @param {Array.<string>} elements An array of DOM Element id strings to remove all children from
   * @param {string} [xfix] A string to append/prepend to each string in `elements`. (Appends by default)
   * @param {boolean} [preFlag=false] If `true`, will prepend `xfix` to each string in `elements`
   */
  exports.removeGroupChildren = function (elements, xfix, preFlag) {
    for (var i = 0; i < elements.length; i++) {
      var id = void 0;
      if (typeof xfix == 'string') {
        id = !preFlag ? elements[i] + xfix : xfix + elements[i];
      } else {
        id = elements[i];
      }
      this.removeChildren(id);
    }
  };

  /**
   * Given a `select` element's `id` in the form of a string, returns the
   * selected `option`'s `value`. Optionally, specify a data type to return.
   * @param   {string} elementID        The `id` of the `select` element
   * @param   {string} [type=string]    The return value's data type [Default: `string`]
   * @returns {string|number}           The `select` element's selected `option`'s `value` parameter.
   */
  exports.getSelectValue = function (elementID, type) {
    var e = document.querySelector(elementID);
    switch (type) {
      case 'int':
        return parseInt(e.options[e.selectedIndex].value);
      default:
        return e.options[e.selectedIndex].value;
    }
  };

  /**
   * Given a `select` element's `id` in the form of a string, gives the
   * `option` element at the given `index` a `selected` parameter.
   * Note: Passing `-1` as `index` or not defining it to clears selection.
   * @param {string} elementID  The `id` parameter of the `select` element
   * @param {number} index      The index of the `option` element to mark as `selected`.
   */
  exports.setSelectValue = function (elementID, index) {
    var e = document.querySelector(elementID);
    e.selectedIndex = index == undefined ? -1 : index;
  };

  /**
   * Given a nodeList, returns its contents as an array.
   * @param {nodeList} nodeList -
   *   A nodeList
   * @returns {Node[]} -
   *   The nodeList in the form of an array.
   */
  exports.nodeListToArray = function (nodeList) {
    return [].slice.call(nodeList);
  };
}).call(undefined);
