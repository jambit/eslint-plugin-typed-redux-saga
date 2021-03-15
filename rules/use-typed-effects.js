'use strict';

module.exports = {
    meta: {
        type: 'suggestion',

        docs: {
            description: 'Use typed-redux-saga for effects',
            category: 'Best Practices',
            recommended: true,
            url: 'https://github.com/jambit/eslint-plugin-typed-redux-saga/',
        },
        fixable: 'code',
        schema: [
            {
                enum: ['default', 'macro'],
            },
        ],
    },
    create(context) {
        const useMacros = context.options[0] === 'macro';
        const targetValue = useMacros
            ? 'typed-redux-saga/macro'
            : 'typed-redux-saga';
        const sourceValues = [
            'redux-saga/effects',
            useMacros ? 'typed-redux-saga' : 'typed-redux-saga/macro',
        ];
        const message = `You should use ${targetValue} for saga effects`;

        return {
            ImportDeclaration(node) {
                if (sourceValues.includes(node.source.value)) {
                    context.report({
                        node,
                        message,
                        fix(fixer) {
                            const sourceCode = context.getSourceCode();
                            const fixed = sourceCode
                                .getText(node)
                                .replace(node.source.value, targetValue);
                            return fixer.replaceText(node, fixed);
                        },
                    });
                }
            },
        };
    },
};
