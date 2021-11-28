"use strict";

const Effects = require("../utils/effects");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforces yield* in front of effects",
      category: "Possible Problems",
      recommended: true,
      url: "https://github.com/jambit/eslint-plugin-typed-redux-saga/",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
  },

  create(context) {
    const tracker = Effects.tracker();

    return {
      ImportDeclaration: tracker.enterImportDeclartion,
      FunctionDeclaration: tracker.enterFunction,
      "FunctionDeclaration:exit": tracker.exitFunction,
      FunctionExpression: tracker.enterFunction,
      "FunctionExpression:exit": tracker.exitFunction,
      YieldExpression: tracker.enterYieldExpression,
      "YieldExpression:exit": tracker.exitYieldExpression,

      CallExpression(node) {
        const callee = node.callee;
        if (tracker.isNodeEffect(node)) {
          const importedName = tracker.getEffectImportName(node);
          let effectName = callee.name;
          if (importedName !== effectName) {
            effectName += " (" + importedName + ")";
          }
          if (tracker.isInYieldExpression() && tracker.isInGenerator()) {
            context.report({
              node: node,
              message: effectName + " effect must be yielded",
              suggest: [
                {
                  desc: "Add yield*",
                  fix: function (fixer) {
                    return fixer.insertTextBefore(node, "yield* ");
                  },
                },
              ],
            });
          }
        }
      },
    };
  },
};
