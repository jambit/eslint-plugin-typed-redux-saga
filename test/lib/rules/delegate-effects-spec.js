"use strict";
const rule = require("../../../lib/rules/delegate-effects");
const RuleTester = require("eslint").RuleTester;

function createTestCases(macro = "") {
  return {
    valid: [
      {
        code: `import { take } from 'typed-redux-saga${macro}';
        function* test() {
          yield* take('ACTION')
        }`,
      },
      {
        code: `import { delay } from 'typed-redux-saga${macro}';
        function* test() {
          yield* delay(1000)
        }`,
      },
      {
        code: `import { take } from 'typed-redux-saga${macro}';
        function* test() {
          yield* take('ACTION')
        }`,
      },
      {
        code: `import { take as t } from 'typed-redux-saga${macro}';
        function* test() {
          yield* t('ACTION')
        }`,
      },
      {
        code: `import { delay as d } from 'typed-redux-saga${macro}';
        function* test() {
          yield* d(1000)
        }`,
      },
      {
        // If it is an effect name but not imported from `typed-redux-saga` then its valid
        code: "function* test() { take('ACTION') }",
      },
      {
        // If it is an effect name but not imported from `typed-redux-saga` then its valid
        code: "function* test() { delay(1000) }",
      },
      {
        code: `import { take } from 'typed-redux-saga${macro}';
        function* test() {
          notAnEffectDoesNotNeedYield()
        }`,
      },
      {
        code: `import createSagaMiddleware from 'typed-redux-saga${macro}';
        const sagaMiddleware = createSagaMiddleware();`,
      },
      {
        code: `import { noop } from 'typed-redux-saga${macro}';
        function* test() { noop() }`,
      },
      {
        code: `import { call } from 'typed-redux-saga${macro}';
        function* test() {
          const [foo, bar] = yield* [call(something), call(somethingElse)]
        }`,
      },
      {
        code: `import { put } from 'typed-redux-saga${macro}';
        expect(generator.next().value).toEqual(put({}));`,
      },
      {
        code: `import { call, all, delay, fetchResources } from 'typed-redux-saga${macro}';
          function* test() {
            yield* all([
              call(fetchResource, 'users'),
              call(fetchResource, 'comments'),
              call(delay, 1000)])
          }`,
      },
      {
        code: `import { takeEvery } from 'typed-redux-saga${macro}';
        export const fooSagas = [takeEvery('FOO_A', fooASaga), takeEvery('FOO_B', fooBSaga)];`,
      },
      {
        code: `import { call } from 'typed-redux-saga${macro}';
          export class FooSaga {
            static* someSaga() {
              yield* call(() => {})
            }
          }`,
      },
      {
        code: `import { call } from 'typed-redux-sag${macro}';
          export class FooSaga {
            static* someSaga() {
              call(() => {})
            }
          }`,
      },
    ],
    invalid: [
      {
        code: `import { take } from 'typed-redux-saga${macro}'; function* test() { take('ACTION') }`,
        output:  `import { take } from 'typed-redux-saga${macro}'; function* test() { yield* take('ACTION') }`,
        errors: [
          {
            message: 'take effect must be yielded',
          }
        ],
      },
      {
        code: `import { delay } from 'typed-redux-saga${macro}'; function* test() { delay('ACTION') }`,
        output: `import { delay } from 'typed-redux-saga${macro}'; function* test() { yield* delay('ACTION') }`,
        errors: [
          {
            message: "delay effect must be yielded",
          },
        ],
      },
      {
        code: `import { take as t } from 'typed-redux-saga${macro}'; function* test() { t('ACTION') }`,
        output: `import { take as t } from 'typed-redux-saga${macro}'; function* test() { yield* t('ACTION') }`,
        errors: [
          {
            message: "t (take) effect must be yielded",
          },
        ],
      },
      {
        code: `import { delay as d } from 'typed-redux-saga${macro}'; function* test() { d('ACTION') }`,
        output: `import { delay as d } from 'typed-redux-saga${macro}'; function* test() { yield* d('ACTION') }`,
        errors: [
          {
            message: "d (delay) effect must be yielded",
          },
        ],
      },
      {
        code: `import { call } from 'typed-redux-saga${macro}'; export class FooSaga { static* someSaga() {call(() => {})}}`,
        output: `import { call } from 'typed-redux-saga${macro}'; export class FooSaga { static* someSaga() {yield* call(() => {})}}`,
        errors: [
          {
            message: "call effect must be yielded",
          },
        ],
      },
      {
        code: `import { take } from 'typed-redux-saga${macro}'; function* test() { yield take('ACTION') }`,
        output:  `import { take } from 'typed-redux-saga${macro}'; function* test() { yield* take('ACTION') }`,
        errors: [
          {
            message: rule.USE_TYPED_YIELD_MESSAGE,
          }
        ],
      },
      {
        code: `import { delay } from 'typed-redux-saga${macro}'; function* test() { yield delay(1000) }`,
        output:  `import { delay } from 'typed-redux-saga${macro}'; function* test() { yield* delay(1000) }`,
        errors: [
          {
            message: rule.USE_TYPED_YIELD_MESSAGE,
          }
        ],
      },
      {
        code: `import { take as t } from 'typed-redux-saga${macro}'; function* test() { yield t('ACTION') }`,
        output:  `import { take as t } from 'typed-redux-saga${macro}'; function* test() { yield* t('ACTION') }`,
        errors: [
          {
            message: rule.USE_TYPED_YIELD_MESSAGE,
          }
        ],
      },
      {
        code: `import { delay as d } from 'typed-redux-saga${macro}'; function* test() { yield d(1000) }`,
        output: `import { delay as d } from 'typed-redux-saga${macro}'; function* test() { yield* d(1000) }`,
        errors: [
          {
            message: rule.USE_TYPED_YIELD_MESSAGE,
          }
        ],
      },
      {
        code: `import { call, all, delay, fetchResources } from 'typed-redux-saga${macro}'; function* test() { yield all([call(fetchResource, 'users'),call(fetchResource, 'comments'),call(delay, 1000)]) }`,
        output:  `import { call, all, delay, fetchResources } from 'typed-redux-saga${macro}'; function* test() { yield* all([call(fetchResource, 'users'),call(fetchResource, 'comments'),call(delay, 1000)]) }`,
        errors: [
          {
            message: rule.USE_TYPED_YIELD_MESSAGE,
          }
        ],
      },
      {
        code: `import { call } from 'typed-redux-saga${macro}'; export class FooSaga { static* someSaga() { yield call(() => {}) } }`,
        output: `import { call } from 'typed-redux-saga${macro}'; export class FooSaga { static* someSaga() { yield* call(() => {}) } }`,
        errors: [
          {
            message: rule.USE_TYPED_YIELD_MESSAGE,
          }
        ],
      },
    ],
  };
}

const ruleTester = new RuleTester();
ruleTester.run("yield-effects", rule, createTestCases());
ruleTester.run("yield-effects", rule, createTestCases("/macro"));
