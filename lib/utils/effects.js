"use strict";

const knownEffects = Object.keys(require("typed-redux-saga"));

function isEffectImport(value) {
  return /^typed-redux-saga/.test(value);
}

/**
 * Builds state for tracking where an effect is being called.
 */
function tracker() {
  let inYieldDepth = 0;
  let inGeneratorDepth = 0;
  let effectLocalNames = [];
  let effectImportedNames = [];

  function getLocalNameIndex(node) {
    let callee = node.callee;
    return effectLocalNames.indexOf(callee.name);
  }

  return {
    enterFunction(node) {
      if (node.generator) {
        ++inGeneratorDepth;
      }
    },
    exitFunction(node) {
      if (node.generator) {
        --inGeneratorDepth;
      }
    },
    enterYieldExpression() {
      inYieldDepth += 1;
    },
    exitYieldExpression() {
      inYieldDepth -= 1;
    },
    enterImportDeclartion(node) {
      if (isEffectImport(node.source.value)) {
        node.specifiers.forEach(function (specifier) {
          if (
            specifier.type === "ImportSpecifier" &&
            knownEffects.indexOf(specifier.imported.name) !== -1
          ) {
            effectLocalNames.push(specifier.local.name);
            effectImportedNames.push(specifier.imported.name);
          }
        });
      }
    },
    isNodeEffect(node) {
      return getLocalNameIndex(node) !== -1;
    },
    getEffectImportName(node) {
      let localNameIndex = getLocalNameIndex(node);
      return effectImportedNames[localNameIndex];
    },
    isInYieldExpression() {
      return inYieldDepth === 0;
    },
    isInGenerator() {
      return inGeneratorDepth > 0;
    }
  }
}

module.exports = {
  isEffectImport: isEffectImport,
  tracker: tracker,
  knownEffects: knownEffects,
};
