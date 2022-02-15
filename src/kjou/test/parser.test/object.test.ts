import { deepStrictEqual } from 'assert';
import { KjouParser } from '../../parser';

deepStrictEqual(new KjouParser('{}').parseObject(), {});
