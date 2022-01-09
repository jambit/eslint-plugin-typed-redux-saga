# Description

These are eslint rules to help with [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga).

It includes an auto-fix option, so you can use it to easily convert your codebase from redux-saga to typed-redux-saga!
(As always, you should double-check if the auto-fixer did its job correctly before committing the changes!)

## How to Use

Install the plugin via npm:

`npm i -D @jambit/eslint-plugin-typed-redux-saga`

Add it to your eslint configuration as seen below.
Keep in mind that you don't want to run these rules in your test files, since there you most likely need to use the imports from `redux-saga/effects`.

```json
{
    "plugins": ["@jambit/typed-redux-saga"],
    "rules": {},
    "overrides": [
        {
            "files": ["./**/*.ts"],
            "excludedFiles": ["./**/*.spec.ts"],
            "rules": {
                "@jambit/typed-redux-saga/use-typed-effects": "error",
                "@jambit/typed-redux-saga/delegate-effects": "error",
                "@jambit/typed-redux-saga/yield-effects": "error",
            }
        }
    ]
}
```

## Included-rules

### @jambit/typed-redux-saga/use-typed-effects

This rule ensures that you import from `typed-redux-saga` instead of `redux-saga/effects`.

If you want to use the [babel macro feature](https://github.com/agiledigital/typed-redux-saga#babel-macro), this rule can be configured to use `typed-redux-saga/macro` instead:

```json
"@jambit/typed-redux-saga/use-typed-effects": ["error", "macro"]
```

The second entry in the options array can be either "default" or "macro".

### @jambit/typed-redux-saga/delegate-effects

This rule ensures that you use `yield*` instead of `yield` on effects from `typed-redux-saga` and `typed-redux-saga/macro`.

### @jambit/typed-redux-saga/yield-effects

This rule ensures that you don't forget to use `yield*` on effects from `typed-redux-saga` and `typed-redux-saga/macro`. It's a drop-in replacement for [eslint-plugin-redux-saga's yield-effects rule](https://github.com/pke/eslint-plugin-redux-saga/blob/master/docs/rules/yield-effects.md).

## License

Licensed under MIT
