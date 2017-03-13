/**
 * @fileoverview Options configuration for optionator.
 * @author Ian VanSchooten
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const optionator = require('optionator');

//------------------------------------------------------------------------------
// Initialization and Public Interface
//------------------------------------------------------------------------------


module.exports = optionator({
  prepend: 'usage: eslint-filtered-fix [file.js or dir]',
  options: [{
    heading: 'Options'
  }, {
    option     : 'help',
    alias      : 'h',
    type       : 'Boolean',
    description: 'Show help'
  }, {
    option     : 'version',
    alias      : 'v',
    type       : 'Boolean',
    description: 'Outputs the version number'
  }, {
    option     : 'ext',
    type       : '[String]',
    default    : '.js',
    description: 'Specify JavaScript file extensions'
  }, {
    option     : 'rule',
    alias      : 'r',
    type       : '[String]',
    description: 'Specify one or more rules to fix'
  }]
});
