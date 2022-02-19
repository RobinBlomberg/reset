import { strictEqual } from 'assert';
import { KjouNode } from '../../node';
import { KjouSerializer } from '../../serializer';

const serializer = new KjouSerializer();

export const testSerializer = () => {
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

  // Node:
  strictEqual(
    serializer.serializeValue(new KjouNode({ name: 'node' })),
    'node',
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
};
