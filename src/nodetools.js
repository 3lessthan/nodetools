define([
  './lib/appendNode',
  './lib/appendComponent'
], function ( appendNode, appendComponent ) {
  'use strict';
  return {
         appendNode: appendNode,
    appendComponent: appendComponent
  };
});