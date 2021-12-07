'use strict';

const { createTracker } = require('../utils/tracker');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforces yield* in front of effects',
            category: 'Possible Problems',
            recommended: true,
            url: 'https://github.com/jambit/eslint-plugin-typed-redux-saga/',
        },
        fixable: 'code',
        hasSuggestions: true,
        schema: [],
    },
    create(context) {
        const tracker = createTracker();

        return {
            ImportDeclaration: tracker.enterImportDeclartion,
            FunctionDeclaration: tracker.enterFunction,
            'FunctionDeclaration:exit': tracker.exitFunction,
            FunctionExpression: tracker.enterFunction,
            'FunctionExpression:exit': tracker.exitFunction,
            YieldExpression: tracker.enterYieldExpression,
            'YieldExpression:exit': tracker.exitYieldExpression,

            CallExpression(node) {
                if (tracker.isNodeEffect(node)) {
                    if (
                        !tracker.isInYieldExpression() &&
                        tracker.isInGenerator()
                    ) {
                        const effectName = tracker.getEffectName(node);
                        context.report({
                            node: node,
                            message: effectName + ' effect must be yielded',
                            suggest: [
                                {
                                    desc: 'Add yield*',
                                    fix(fixer) {
                                        return fixer.insertTextBefore(
                                            node,
                                            'yield* '
                                        );
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
