'use strict';

module.exports = {
    rules: {
        'yield-effects': require('./lib/rules/yield-effects'),
        'use-typed-effects': require('./lib/rules/use-typed-effects'),
        'delegate-effects': require('./lib/rules/delegate-effects'),
    },
};
