define(
['./appendNode'],
function( appendNode ) {

  /**
   * Given a `nodeComponent`, will loop through each of
   * the properties and append each to the DOM.
   *
   * @param {Object} component -
   *  The `nodeComponent` to add to the DOM
   */
  const appendComponent = function ( component ) {
    for ( let node in component ) {
      if ( !component.hasOwnProperty(node) ) continue;
      if ( Array.isArray( component[node] ))
        for ( let i = 0, n = component[node].length; i < n; i++ ) {
          appendNode( component[node][i] );
        }
      else appendNode( component[node] );
    }
  };

  return appendComponent;

});