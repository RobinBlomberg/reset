import { strictEqual } from 'assert';
import { KjouParser } from '../../parser';

strictEqual(new KjouParser('false').parseEnum(), false);
strictEqual(new KjouParser('true').parseEnum(), true);
strictEqual(new KjouParser('null').parseEnum(), null);
strictEqual(new KjouParser('name').parseEnum(), 'name');
