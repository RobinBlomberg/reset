import { deepStrictEqual, strictEqual } from 'assert';
import { KjouNode } from '../../node';
import { KjouParser } from '../../parser';

strictEqual(new KjouParser('false').parseEnum(), false);
strictEqual(new KjouParser('true').parseEnum(), true);
strictEqual(new KjouParser('null').parseEnum(), null);
deepStrictEqual(
  new KjouParser('name').parseEnum(),
  new KjouNode({ name: 'name' }),
);
