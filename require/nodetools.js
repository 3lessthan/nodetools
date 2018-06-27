(function () {

  let exports = Object.create(null);

  const HTMLELMS = new RegExp(/(?:^a(?:bbr|cronym|ddress|pplet|r(?:ea|ticle)|side|udio)?$)|(?:^b(?:ase(?:font)?|d[io]|ig|lockquote|ody|r|utton)?$)|(?:^c(?:a(?:nvas|ption)|enter|ite|o(?:de|l(?:group)?))$)|(?:^d(?:ata(?:list)?|d|e(?:l|tails)|fn|i(?:alog|[rv])|[lt])$)|(?:^em(?:bed)?$)|(?:^f(?:i(?:eldset|g(?:caption|ure))|o(?:nt|oter|rm)|rame(?:set)?)$)|(?:^h(?:[1-6]|ead(?:er)?|r|tml)$)|(?:^i(?:frame|mg|n(?:put|s))?$)|(?:^kbd$)|(?:^l(?:abel|egend|i(?:nk)?)$)|(?:^m(?:a(?:in|p|rk)|et(?:a|er))$)|(?:^n(?:av|o(?:frames|script))$)|(?:^o(?:bject|l|pt(?:group|ion)|utput)$)|(?:^p(?:aram|icture|r(?:e|ogress))?$)|(?:^q$)|(?:^r(?:[pt]|uby)$)|(?:^s(?:amp|cript|e(?:ction|lect)|mall|ource|pan|t(?:r(?:ike|ong)|yle)|u(?:[bp]|mmary)|vg)?$)|(?:^t(?:able|body|[dt]|e(?:mplate|xtarea)|foot|h(?:ead)?|i(?:me|tle)|r(?:ack)?)$)|(?:^ul?$)|(?:^v(?:ar|ideo)$)|(?:^wbr$)/);

  /**
   * Given an option set from a `nodeComponent`
   * object property, will create a node and
   * append it to the DOM.
   *
   * @param {object} options -
   *   `nodeComponent` object
   */
  exports.appendNode = function (options) {
    // Test for existence of parent property
    if (options.hasOwnProperty('parent')) {
      // Test for existence of parent element
      let parent = getHTMLElement(options.parent);
      if (parent) {
        if (options.hasOwnProperty('e')) {
          // Create node
          let node = document.createElement(options.e);
          // If text option exists, append it
          if (options.hasOwnProperty('text'))
            node.appendChild(document.createTextNode(options.text));

          // Loop through parameters and append them
          if (options.hasOwnProperty('params')) {
            let params = options.params;
            for (let key in params) {
              if (!params.hasOwnProperty(key)) continue;
              let param = document.createAttribute(key);
              if (options.params[key] !== null) param.value = options.params[key];
              node.setAttributeNode(param);
            }
            parent.appendChild(node);
            if (options.hasOwnProperty('html')) node.innerHTML = options.html;
            if (params.hasOwnProperty('id')) return getHTMLElement(params.id);
          } else {
            // Else, append the node as is
            parent.appendChild(node);
            if (options.hasOwnProperty('html')) node.innerHTML = options.html;
          }
        }
        // If only text/html & parent is provided, append text to innerHTML
        else if (options.hasOwnProperty('text') || options.hasOwnProperty('html'))
          parent.innerHTML += options.text;
        else console.log('appendNode failed, invalid properties provided.');
      } else console.log('appendNode failed, invalid parent id:', options.parent);
    } else console.log('appendNode failed, no parent id provided.');
  };

  /**
   * Given a `nodeComponent`, will loop through
   * all of its properties and append each to
   * the DOM.
   *
   * @param {object} component -
   *   The `nodeComponent` to add to the DOM
   */
  exports.appendComponent = function (component) {
    for (let node in component) {
      if (!component.hasOwnProperty(node)) continue;
      if (Array.isArray(component[node]))
        for (let n of component[node]) { this.appendNode(n); }
      else this.appendNode(component[node]);
    }
  };

  /**
   * Removes all children of the passed element,
   * or the element with the passed id.
   * If the `element` argument is a string, it
   * must be the element's id.
   *
   * @param {DOMElement|string} element -
   *   The DOM Element node or id attribute of a
   *   DOM Element to remove all children from.
   */
  exports.removeChildren = function (element) {
    element = getHTMLElement(element);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  /**
   * Given an array of element ids, and optionally,
   * a pre/postfix string to append to the id list,
   * loops through the elements, removing all of
   * each of their children.
   *
   * @param {string[]} elements -
   *   An array of DOM Element id strings to remove
   *   all children from.
   */
  exports.removeGroupChildren = function (elements) {
    if (elements instanceof NodeList)
      for (let n = 0, nl = this.nodeListToArray(elements); n < nl.length; n++) {
        this.removeChildren(nl[n]);
      }
    else if (Array.isArray(elements))
      for (let e of elements) {
        this.removeChildren(getHTMLElements(e));
      }
    else console.error(`[nodetools.removeGroupChildren] Notice: Cannot get HTMLElements from: ${elements}`);
  };

  /**
   * Given a nodeList, returns its contents as
   * an array. If nodeList is a string, it will
   * try to get a NodeList using `querySelectorAll`.
   *
   * @param {nodeList} nodeList -
   *   A nodeList
   *
   * @returns {Node[]} -
   *   The nodeList in the form of an array.
   */
  exports.nodeListToArray = function (nodeList) {
    return nodeList instanceof NodeList ?
      [].slice.call(nodeList) :
      typeof nodeList === 'string' ?
        this.nodeListToArray(document.querySelectorAll(nodeList)) :
        console.error(`[nodetools.nodeListToArray] Notice: Cannot get NodeList from: ${nodeList}`);
  };

  const eHTMLGet = function(e, many) {
    return e instanceof HTMLElement || e instanceof NodeList ? e :
      HTMLELMS.test(e) ? document['querySelector' + (many ? 'All' : '')](e) :
        eHTMLGet( document['querySelector' + (many ? 'All' : '')](typeof e !== 'string' ? undefined : e.charAt() === '#' || e.charAt() === '.' ? e : '#' + e), many);
  };

  const getHTMLElement = function (e) {
    return eHTMLGet.call(undefined, e, false);
  };

  const getHTMLElements = function (e) {
    return eHTMLGet.call(undefined, e, true);
  };

  const isUndefOrNaN = function (v) {
    return v === undefined || Number.isNaN(parseInt(v));
  };


  const selectIndex = function (funcName, element, callback, ...args) {
    return (element instanceof HTMLSelectElement) ? callback(element, ...args) :
      (element instanceof NodeList) ? this.nodeListToArray(element).forEach(v => callback(v, ...args)) :
        (typeof element === 'string') ? this[funcName](getHTMLElements(element), ...args) :
          console.error(`[nodetools.${funcName}] Notice: Cannot get HTMLSelectElement from: ${element}`);
  };

  /**
   * Given a `select` HTML element's `id` in the
   * form of a string, gives the `option` element
   * at the given `index` a `selected` parameter.
   *
   * > Note: Passing `-1` as `index` or not
   *         defining it clears selection.
   *
   * @param {string} elementID -
   *   The `id` parameter of the `select`
   *   element
   *
   * @param {number} index -
   *   The index of the `option` element to
   *   mark as `selected`.
   */
  exports.setSelectIndex = function (selectElement, index) {
    return selectIndex.call(
      this, 'setSelectIndex', selectElement,
      (e, i) => e.selectedIndex = isUndefOrNaN(i) ? -1 : parseInt(i),
      index
    );
  };

  /**
   * Given a `select` element, by way of the HTML
   * Element itself, or the `id` in the form of a
   * string, returns the selected option's index.
   *
   * @param   {string} elementID -
   *   The `id` of the `select` element
   *
   * @returns {string|number} -
   *   The `select` element's selected `option`'s
   *   `index`.
   */
  exports.getSelectIndex = function (selectElement) {
    return selectIndex.call(
      this, 'getSelectIndex', selectElement,
      e => e.options[e.selectedIndex]
    );
  };

  /**
   * Given a `select` element's `id` in the form of a
   * string, returns the selected `option`'s `value`.
   * Optionally, specify a data type to return.
   *
   * @param   {string} elementID -
   *   The `id` of the `select` element
   *
   * @param   {string} [type=string] -
   *   The return value's data type [Default: `string`]
   *
   * @returns {string|number} -
   *   The `select` element's selected `option`'s
   *   `value` parameter.
   */
  exports.getSelectValue = function (selectElement) {
    return selectIndex.call(
      this, 'getSelectIndex', selectElement,
      e => e.options[e.selectedIndex].value
    );
  };

  return exports;

});