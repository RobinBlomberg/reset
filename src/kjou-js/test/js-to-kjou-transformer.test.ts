import { deepStrictEqual } from 'assert';
import { KjouParser } from '../../kjou/parser';
import { JsToKjouTransformer } from '../js-to-kjou-transformer';

export const testJsToKjouTransformer = () => {
  deepStrictEqual(
    new JsToKjouTransformer().transformValue([
      123,
      {
        map: new Map<string, unknown>([
          ['foo', 'bar'],
          ['baz', [42]],
        ]),
        props: {
          date: new Date('2022-02-19'),
        },
        regex: /^test$/,
        set: new Set(['foo', 123]),
      },
    ]),
    new KjouParser(`
      123
      {
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
  );
};