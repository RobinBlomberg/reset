import { deepStrictEqual } from 'assert';
import { KjouNode, KjouParser } from '~kjou';

deepStrictEqual(
  new KjouParser('name').parseNode(),
  new KjouNode({ name: 'name' }),
);

// Attributes:
deepStrictEqual(
  new KjouParser('a()').parseNode(),
  new KjouNode({ name: 'a', props: {} }),
);
deepStrictEqual(
  new KjouParser('meta(name:description)').parseNode(),
  new KjouNode({
    name: 'meta',
    props: {
      attributes: { name: new KjouNode({ name: 'description' }) },
    },
  }),
);
deepStrictEqual(
  new KjouParser('foo ( bar : baz qux : -0 , a b ) ').parseNode(),
  new KjouNode({
    name: 'foo',
    props: {
      args: [new KjouNode({ name: 'a' }), new KjouNode({ name: 'b' })],
      attributes: {
        bar: new KjouNode({ name: 'baz' }),
        qux: -0,
      },
    },
  }),
);

// Children:
deepStrictEqual(
  new KjouParser('title{};').parseNode(),
  new KjouNode({ children: [], name: 'title' }),
);
deepStrictEqual(
  new KjouParser('_{}').parseNode(),
  new KjouNode({ children: [], name: '_' }),
);
deepStrictEqual(
  new KjouParser('0-1(){}').parseNode(),
  new KjouNode({
    children: [],
    name: '0-1',
    props: {},
  }),
);
deepStrictEqual(
  new KjouParser(
    `html(lang: 'en-US') {
      head {
        meta(name: 'description')
        meta(http-equiv: 'X-UA-Compatible', content: 'IE=edge')
        title{'Untitled Document'}
      }
      body {
        'Hello world!'
      }
    }`,
  ).parseNode(),
  new KjouNode({
    children: [
      new KjouNode({
        children: [
          new KjouNode({
            name: 'meta',
            props: { attributes: { name: 'description' } },
          }),
          new KjouNode({
            name: 'meta',
            props: {
              attributes: {
                content: 'IE=edge',
                'http-equiv': 'X-UA-Compatible',
              },
            },
          }),
          new KjouNode({ children: ['Untitled Document'], name: 'title' }),
        ],
        name: 'head',
      }),
      new KjouNode({ children: ['Hello world!'], name: 'body' }),
    ],
    name: 'html',
    props: {
      attributes: { lang: 'en-US' },
    },
  }),
);
deepStrictEqual(new KjouParser('a {}').parseDocument(), [
  new KjouNode({ children: [], name: 'a' }),
]);
deepStrictEqual(
  new KjouParser(
    `fragment comparisonFields on Character {
      name
      friendsConnection(first: $first) {
        totalCount
        edges {
          node {
            name
          }
        }
      }
    }`,
  ).parseDocument(),
  [
    new KjouNode({ name: 'fragment' }),
    new KjouNode({ name: 'comparisonFields' }),
    new KjouNode({ name: 'on' }),
    new KjouNode({
      children: [
        new KjouNode({ name: 'name' }),
        new KjouNode({
          children: [
            new KjouNode({ name: 'totalCount' }),
            new KjouNode({
              children: [
                new KjouNode({
                  children: [new KjouNode({ name: 'name' })],
                  name: 'node',
                }),
              ],
              name: 'edges',
            }),
          ],
          name: 'friendsConnection',
          props: {
            attributes: {
              first: new KjouNode({ name: '$first' }),
            },
          },
        }),
      ],
      name: 'Character',
    }),
  ],
);
