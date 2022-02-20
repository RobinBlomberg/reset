import { KjouNode } from './node';
import { KjouParser } from './parser';
import { KjouSerializer, KjouSerializerOptions } from './serializer';

export class Kjou {
  static format(data: string) {
    const document = new KjouParser(data).parseDocument();
    return new KjouSerializer({ pretty: true }).serializeDocument(document);
  }

  static parse(data: string) {
    return new KjouParser(data).parseDocument();
  }

  static serialize(document: KjouNode[], options: KjouSerializerOptions) {
    return new KjouSerializer(options).serializeDocument(document);
  }
}
