# Description

These are eslint rules to help with [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga)

## How to Use

Install the plugin via npm:

`npm i -D @jambit/eslint-plugin-typed-redux-saga`

Add it to your eslint configuration as seen below. 
Keep in mind, that you don't want to run these rules in your test files, since there you most likely need to use the imports from `redux-saga/effects`.

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
        "@jambit/typed-redux-saga/delegate-effects": "error"
      }
    }
  ]
}
```

## Included-rules

### @jambit/typed-redux-saga/use-typed-effects

This rule ensures, that you import from `typed-redux-saga` instead of `redux-saga/effects`.

### @jambit/typed-redux-saga/delegate-effects

This rule ensures, that you use `yield*` on effects from `typed-redux-saga`.

## License

Licensed under MIT
