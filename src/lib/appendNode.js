define( function () {

  /**
   * Given an option set from a `nodeComponent` object
   * property, will create a node and append it to the DOM.
   *
   * @param {Object} options -
   *  `nodeComponent` object
   */
  const appendNode = function ( options ) {
    // Test for existence of parent property
    if (options.hasOwnProperty('parent')) {
      // Test for existence of parent element
      let parent = document.getElementById(options.parent);
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
            if (params.hasOwnProperty('id')) return document.getElementById(params.id);
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
      } else console.log('appendNode failed, invalid parent id:',options.parent);
    } else   console.log('appendNode failed, no parent id provided.');
  };

  return appendNode;

});