import { KjouParser } from './parser';

export class Kjou {
  static parseDocument(data: string) {
    return new KjouParser(data).parseDocument();
  }

  static parseValue(data: string) {
    return new KjouParser(data).parseValue();
  }
}
