import { JSONPlus } from '.';

const JSON = new JSONPlus();

/**
 * TODO: Recursively revive values.
 */
console.dir(
  JSON.parse(
    JSON.stringify(
      {
        foo: {
          bar: ['baz'],
          bigint: 3n,
          createdAt: new Date(),
          error: new TypeError('Something went wrong.'),
          infinity: Infinity,
          map: new Map([['foo', new Map([['foo', { bar: 'baz' }]])]]),
          nan: NaN,
          negativeInfinity: -Infinity,
          negativeZero: -0,
          object: {
            title: 'Untitled Document',
          },
          set: new Set(['foo', 'bar']),
          string: 'hello',
          symbol: Symbol('test'),
          undefined,
        },
      },
      null,
      2,
    ),
  ),
  { depth: null },
);
