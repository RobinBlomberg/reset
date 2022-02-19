import { deepStrictEqual } from 'assert';
import { KjouNode } from '../../node';
import { KjouParser } from '../../parser';

deepStrictEqual(new KjouParser('foo bar; baz').parseDocument(), [
  new KjouNode({ name: 'foo' }),
  new KjouNode({ name: 'bar' }),
  new KjouNode({ name: 'baz' }),
]);
deepStrictEqual(
  new KjouParser(`
    select(
      from: 'users'
      columns: ['fullName', 'email']
      where: {
        email: {
          endsWith: '@bemlo.se'
        }
      }
    )
  `).parseDocument(),
  [
    new KjouNode({
      name: 'select',
      props: {
        args: [],
        attributes: {
          columns: ['fullName', 'email'],
          from: 'users',
          where: { email: { endsWith: '@bemlo.se' } },
        },
      },
    }),
  ],
);
deepStrictEqual(
  new KjouParser(`
    {
      createdAt: Date(2022-02-19)
      pattern: /^test$/
      names: Set {
        'Randolph'
        'Minnie'
      }
      settings: Map {
        foo: bar
        baz: qux
      }
    }
  `).parseDocument(),
  [
    {
      createdAt: new KjouNode({
        name: 'Date',
        props: { args: ['2022-02-19'], attributes: {} },
      }),
      names: new KjouNode({ children: ['Randolph', 'Minnie'], name: 'Set' }),
      pattern: new KjouNode({ name: '/^test$/' }),
      settings: new KjouNode({
        children: [
          new KjouNode({ alias: 'foo', name: 'bar' }),
          new KjouNode({ alias: 'baz', name: 'qux' }),
        ],
        name: 'Map',
      }),
    },
  ],
);
deepStrictEqual(
  new KjouParser(`
    {
      "devDependencies": {
        "@robinblomberg/eslint-config-prettier": "*",
        "@robinblomberg/eslint-config-robinblomberg": "*",
        "@robinblomberg/prettier-config": "*",
        "@types/node": "*",
        "@typescript-eslint/parser": "*",
        "eslint": "^7",
        "typescript": "^4"
      },
      "eslintConfig": {
        "extends": [
          "@robinblomberg/robinblomberg",
          "@robinblomberg/prettier"
        ]
      },
      "prettier": "@robinblomberg/prettier-config"
    }
  `).parseDocument(),
  [
    {
      devDependencies: {
        '@robinblomberg/eslint-config-prettier': '*',
        '@robinblomberg/eslint-config-robinblomberg': '*',
        '@robinblomberg/prettier-config': '*',
        '@types/node': '*',
        '@typescript-eslint/parser': '*',
        eslint: '^7',
        typescript: '^4',
      },
      eslintConfig: {
        extends: ['@robinblomberg/robinblomberg', '@robinblomberg/prettier'],
      },
      prettier: '@robinblomberg/prettier-config',
    },
  ],
);
