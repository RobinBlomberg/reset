import { strictEqual } from 'assert';
import { KjouParser } from '~kjou';

// Numbers:
strictEqual(new KjouParser('123').parseValue(), 123);

// Identifiers:
strictEqual(new KjouParser('123px').parseValue(), '123px');
