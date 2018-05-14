function NodeTools() {
  /**
   * Given an option set from a nodeComponent object property,
   * will create a node and append it to the DOM.
   * @param {Object} options - The type/parameters/text content to add to created node
   */
  this.appendNode = function (options) {
    if (options.hasOwnProperty('e')) {
      let node = document.createElement(options.e),
        parent = document.getElementById(options.parent);

      // If text option exists, append it
      if (options.hasOwnProperty('text'))
        node.appendChild(document.createTextNode(options.text));

      if (options.hasOwnProperty('params')) {
        // Loop through parameters and append them
        let params = options.params;
        for (let key in params) {
          if (!params.hasOwnProperty(key)) continue;
          let param = document.createAttribute(key);
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
    } else if (options.hasOwnProperty('text') && options.hasOwnProperty('parent')) {
      let parent = document.getElementById(options.parent);
      parent.innerHTML += options.text;
    } else if (options.hasOwnProperty('html') && options.hasOwnProperty('parent')) {
      let parent = document.getElementById(options.parent);
      parent.innerHTML += options.html;
    }
  };

  /**
   * Given a nodeComponent, will loop through each of the properties and append each to the DOM.
   * @param {Object} component - The nodeComponent to add to the DOM
   */
  this.appendComponent = function (component) {
    for (let node in component) {
      // skip loop if the property is from prototype
      if (!component.hasOwnProperty(node)) continue;
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          this.appendNode(component[node][i]);
        }
      } else
        this.appendNode(component[node]);
    }
  };

  /**
   * Removes all children of the passed element, or the element with the passed id.
   * If the `element` argument is a string, it must be the element's id.
   * @param {DOMElement|string} element The DOMElement node or id attribute of a DOM Element to remove all children from
   */
  this.removeChildren = function (element) {
    element = (typeof element === 'string' ? document.querySelector(element) : element);
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
  this.removeGroupChildren = function (elements, xfix, preFlag) {
    for (let i = 0; i < elements.length; i++) {
      let id;
      if (typeof xfix == 'string') {
        id = (preFlag === undefined || preFlag === false ? elements[i] + xfix : xfix + elements[i]);
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
  this.getSelectValue = function (elementID, type) {
    let e = document.querySelector(elementID);
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
  this.setSelectValue = function (elementID, index) {
    let e = document.querySelector(elementID);
    e.selectedIndex = (index == undefined ? -1 : index);
  };
}