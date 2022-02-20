import { strictEqual } from 'assert';
import { KjouNode } from '../../node';
import { KjouSerializer } from '../../serializer';

const serializer = new KjouSerializer();

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
  "[-0,[null],'yes']",
);

// Objects:
strictEqual(serializer.serializeValue({}), '{}');
strictEqual(serializer.serializeValue({ foo: 'bar' }), "{foo:'bar'}");
strictEqual(serializer.serializeValue({ a: 'b', c: -5 }), "{a:'b',c:-5}");
strictEqual(
  serializer.serializeValue({
    name: 'Frank',
    settings: { createdAt: 2317823471, title: 'Untitled' },
  }),
  "{name:'Frank',settings:{createdAt:2317823471,title:'Untitled'}}",
);
strictEqual(
  serializer.serializeValue({ foo: { bar: ['baz', 'qux'] } }),
  "{foo:{bar:['baz','qux']}}",
);

// Node:
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
  'button(disabled);',
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
  'employees(employerId:6189,hideInactive:true);',
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
  'add(3,4,float:true);',
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
  "query{addUser(email:'test@example.com'){email;id;};};",
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
  "!doctype(html);html(class:'no-js',lang:'en-US'){head{meta(charset:'utf-8');title{};};body{" +
    "'<!-- Add your site or application content here -->';" +
    "strong(a:null,class:['paragraph','text--red']){" +
    "'Hello world! This is HTML5 Boilerplate.';};};};",
);
