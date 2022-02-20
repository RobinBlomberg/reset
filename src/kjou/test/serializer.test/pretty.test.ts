import { strictEqual } from 'assert';
import { KjouNode } from '../../node';
import { KjouSerializer } from '../../serializer';

const serializer = new KjouSerializer({ pretty: true });

strictEqual(serializer.serializeValue(undefined), 'undefined');
strictEqual(serializer.serializeValue(null), 'null');
strictEqual(serializer.serializeValue(false), 'false');
strictEqual(serializer.serializeValue(true), 'true');
strictEqual(serializer.serializeValue(-123.456), '-123.456');
strictEqual(
  serializer.serializeValue("Hello 'my' friend"),
  "'Hello \\'my\\' friend'",
);

// Arrays:
strictEqual(serializer.serializeValue([]), '[]');
strictEqual(
  serializer.serializeValue([-0, [null], 'yes']),
  "[\n  -0\n  [null]\n  'yes'\n]",
);

// Objects:
strictEqual(serializer.serializeValue({}), '{}');
strictEqual(serializer.serializeValue({ foo: 'bar' }), "{ foo: 'bar' }");
strictEqual(
  serializer.serializeValue({ a: 'b', c: -5 }),
  "{\n  a: 'b'\n  c: -5\n}",
);
strictEqual(
  serializer.serializeValue({
    name: 'Frank',
    settings: { createdAt: 2317823471, title: 'Untitled' },
  }),
  "{\n  name: 'Frank'\n  settings: {\n    createdAt: 2317823471\n    title: 'Untitled'\n  }\n}",
);
strictEqual(
  serializer.serializeValue({ foo: { bar: ['baz', 'qux'] } }),
  '{\n' +
    '  foo: {\n' +
    '    bar: [\n' +
    "      'baz'\n" +
    "      'qux'\n" +
    '    ]\n' +
    '  }\n' +
    '}',
);

// Nodes:
strictEqual(serializer.serializeValue(new KjouNode({ name: 'node' })), 'node');
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      name: 'button',
      props: {
        args: [new KjouNode({ name: 'disabled' })],
      },
    }),
  ]),
  'button(disabled)',
);
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      name: 'employees',
      props: {
        attributes: {
          employerId: 6189,
          hideInactive: true,
        },
      },
    }),
  ]),
  'employees(\n  employerId: 6189\n  hideInactive: true\n)',
);
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      name: 'add',
      props: {
        args: [3, 4],
        attributes: {
          float: true,
        },
      },
    }),
  ]),
  'add(\n  3\n  4\n  float: true\n)',
);
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      children: [],
      name: 'test',
    }),
  ]),
  'test {}',
);
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      children: [
        new KjouNode({
          children: [
            new KjouNode({ name: 'email' }),
            new KjouNode({ name: 'id' }),
          ],
          name: 'addUser',
          props: {
            attributes: {
              email: 'test@example.com',
            },
          },
        }),
      ],
      name: 'query',
    }),
  ]),
  "query {\n  addUser(email: 'test@example.com') {\n    email\n    id\n  }\n}",
);
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      children: [
        new KjouNode({
          alias: 'foo',
          children: [new KjouNode({ name: 'email' })],
          name: 'addUser',
          props: {
            attributes: {
              email: 'test@example.com',
              test: null,
            },
          },
        }),
      ],
      name: 'query',
    }),
  ]),
  'query {\n' +
    '  foo: addUser(\n' +
    "    email: 'test@example.com'\n" +
    '    test: null\n' +
    '  ) {\n' +
    '    email\n' +
    '  }\n' +
    '}',
);
strictEqual(
  serializer.serializeDocument([{ bar: [{ baz: [3], qux: null }] }]),
  '{\n' +
    '  bar: [\n' +
    '    {\n' +
    '      baz: [3]\n' +
    '      qux: null\n' +
    '    }\n' +
    '  ]\n' +
    '}',
);

// Documents:
strictEqual(
  serializer.serializeDocument([
    new KjouNode({ name: 'foo' }),
    new KjouNode({ name: 'bar' }),
  ]),
  'foo\nbar',
);
strictEqual(
  serializer.serializeDocument([
    new KjouNode({
      name: '!doctype',
      props: { args: [new KjouNode({ name: 'html' })] },
    }),
    new KjouNode({
      children: [
        new KjouNode({
          children: [
            new KjouNode({
              name: 'meta',
              props: {
                attributes: {
                  charset: 'utf-8',
                },
              },
            }),
            new KjouNode({
              children: [],
              name: 'title',
            }),
          ],
          name: 'head',
        }),
        new KjouNode({
          children: [
            '<!-- Add your site or application content here -->',
            new KjouNode({
              children: ['Hello world! This is HTML5 Boilerplate.'],
              name: 'strong',
              props: {
                attributes: { a: null, class: ['paragraph', 'text--red'] },
              },
            }),
          ],
          name: 'body',
        }),
      ],
      name: 'html',
      props: {
        attributes: {
          class: 'no-js',
          lang: 'en-US',
        },
      },
    }),
  ]),
  '!doctype(html)\n' +
    'html(\n' +
    "  class: 'no-js'\n" +
    "  lang: 'en-US'\n" +
    ') {\n' +
    '  head {\n' +
    "    meta(charset: 'utf-8')\n" +
    '    title {}\n' +
    '  }\n' +
    '  body {\n' +
    "    '<!-- Add your site or application content here -->'\n" +
    '    strong(\n' +
    '      a: null\n' +
    '      class: [\n' +
    "        'paragraph'\n" +
    "        'text--red'\n" +
    '      ]\n' +
    '    ) {\n' +
    "      'Hello world! This is HTML5 Boilerplate.'\n" +
    '    }\n' +
    '  }\n' +
    '}',
);
