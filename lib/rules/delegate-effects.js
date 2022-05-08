'use strict';

const { createTracker } = require('../utils/tracker');
const USE_TYPED_YIELD_MESSAGE =
    'You should use yield* for all typed-redux-saga effects';

module.exports = {
    USE_TYPED_YIELD_MESSAGE: USE_TYPED_YIELD_MESSAGE,
    meta: {
        type: 'problem',

        docs: {
            description: 'Enforce yield* (delegate) on effects',
            category: 'Possible Errors',
            recommended: true,
            url: 'https://github.com/jambit/eslint-plugin-typed-redux-saga/',
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        const tracker = createTracker();

        function isSagaCall(node) {
            if (node === null) {
                return false;
            }
            
            switch (node.type) {
                case 'CallExpression':
                    return tracker.isNodeEffect(node);
                // Ternary expression might be nested calls
                case 'ConditionalExpression':
                    return (
                        isSagaCall(node.consequent) ||
                        isSagaCall(node.alternate)
                    );
                default:
                    return false;
            }
        }
        return {
            ImportDeclaration: tracker.enterImportDeclartion,
            YieldExpression(node) {
                tracker.enterYieldExpression(node);

                if (!node.delegate && isSagaCall(node.argument)) {
                    context.report({
                        node,
                        message: USE_TYPED_YIELD_MESSAGE,
                        fix(fixer) {
                            const sourceCode = context.getSourceCode();
                            const fixed = sourceCode
                                .getText(node)
                                .replace('yield', 'yield*');
                            return fixer.replaceText(node, fixed);
                        },
                    });
                }
            },
            'YieldExpression:exit': tracker.exitYieldExpression,
            ImportDeclaration: tracker.enterImportDeclartion,
            FunctionDeclaration: tracker.enterFunction,
            'FunctionDeclaration:exit': tracker.exitFunction,
            FunctionExpression: tracker.enterFunction,
            'FunctionExpression:exit': tracker.exitFunction,

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
                            fix(fixer) {
                                return fixer.insertTextBefore(node, 'yield* ');
                            },
                        });
                    }
                }
            },
        };
    },
};
