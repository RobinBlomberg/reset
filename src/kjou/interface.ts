import { KjouParser } from './parser';
import { KjouSerializer } from './serializer';
import { KjouSerializerOptions, KjouValue } from './types';

export class Kjou {
  static format(data: string) {
    const document = new KjouParser(data).parseDocument();
    return new KjouSerializer({ pretty: true }).serializeDocument(document);
  }

  static parseDocument(data: string) {
    return new KjouParser(data).parseDocument();
  }

  static parseValue(data: string) {
    return new KjouParser(data).parseValue();
  }

  static serialize(value: KjouValue, options: KjouSerializerOptions = {}) {
    return new KjouSerializer(options).serializeValue(value);
  }
}
