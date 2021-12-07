'use strict';

const RuleTester = require('eslint').RuleTester;
const parserOptions = require('./parserOptions');

RuleTester.setDefaultConfig({
    parserOptions: parserOptions,
});
