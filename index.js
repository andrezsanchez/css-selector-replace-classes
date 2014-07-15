"use strict";

var CssSelectorParser = require('css-selector-parser').CssSelectorParser
var cssSelector = new CssSelectorParser()

cssSelector.registerSelectorPseudos('has');
cssSelector.registerNestingOperators('>', '+', '~');
cssSelector.registerAttrEqualityMods('^', '$', '*', '~');
cssSelector.enableSubstitutes();

module.exports = replaceClasses

function replaceClasses(selector, map) {
  var ast = cssSelector.parse(selector)
  visitRules(ast, function(node) {
    if (node.classNames) {
      node.classNames = node.classNames.map(function(cls) {
        if (map.hasOwnProperty(cls)) {
          return map[cls]
        }
        else {
          return cls
        }
      })
    }
  })
  return cssSelector.render(ast)
}

function visitRules(node, fn) {
  if (node.rule) {
    visitRules(node.rule, fn)
  }
  if (node.selectors) {
    node.selectors.forEach(function(node) {
      visitRules(node, fn)
    })
  }
  if (node.pseudos) {
    node.pseudos.forEach(function(pseudo) {
      if (pseudo.valueType === 'selector') {
        visitRules(pseudo.value, fn)
      }
    })
  }
  if (node.type === 'rule') {
    fn(node)
  }
}
