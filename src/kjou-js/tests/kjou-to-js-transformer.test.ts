import { deepStrictEqual } from 'assert';
import { KjouParser } from '~kjou';
import { KjouToJsTransformer } from '~kjou-js';

export const testKjouToJsTransformer = () => {
  deepStrictEqual(
    new KjouToJsTransformer().transformValue(
      new KjouParser(`
        123
        {
          error: TypeError('Something went wrong.')
          map: Map([
            ['foo', 'bar']
            ['baz', [42]]
          ])
          props: {
            date: Date(1645228800000)
          }
          regex: RegExp('^test$')
          set: Set([
            'foo'
            123
          ])
        }
      `).parseDocument(),
    ),
    [
      123,
      {
        error: new TypeError('Something went wrong.'),
        map: new Map<string, unknown>([
          ['foo', 'bar'],
          ['baz', [42]],
        ]),
        props: {
          date: new Date(1645228800000),
        },
        regex: /^test$/,
        set: new Set(['foo', 123]),
      },
    ],
  );
};
