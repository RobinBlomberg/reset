import { KjouParser } from './parser';

export class Kjou {
  static parseArray(data: string) {
    return new KjouParser(data).parseArray();
  }

  static parseDocument(data: string) {
    return new KjouParser(data).parseDocument();
  }

  static parseEnum(data: string) {
    return new KjouParser(data).parseEnum();
  }

  static parseIdentifier(data: string) {
    return new KjouParser(data).parseIdentifier();
  }

  static parseKey(data: string) {
    return new KjouParser(data).parseKey();
  }

  static parseInteger(data: string) {
    return new KjouParser(data).parseInteger();
  }

  static parseNode(data: string) {
    return new KjouParser(data).parseNode();
  }

  static parseNumber(data: string) {
    return new KjouParser(data).parseNumber();
  }

  static parseObject(data: string) {
    return new KjouParser(data).parseObject();
  }

  static parseString(data: string) {
    return new KjouParser(data).parseString();
  }

  static parseValue(data: string) {
    return new KjouParser(data).parseValue();
  }
}
