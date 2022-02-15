import { KjouNode } from './node';
import { KjouScanner } from './scanner';
import { KjouChild, KjouObject, KjouValue } from './types';

const COLON_CHAR = ':';
const COMMA_CHAR = ',';
const DECIMAL_DIGIT_CHAR = /^[0-9]$/;
const E_CHAR = /^[eE]$/;
const ESCAPABLE_CHAR = /^[u"'\\/bfnrt]$/;
const ESCAPE_CHAR = '\\';
const HASH_CHAR = '#';
const HEX_CHAR = /^[0-9A-Fa-f]$/;
const IDENTIFIER_CHAR = /^[a-zA-Z0-9_-]$/;
const LEFT_BRACKET_CHAR = '[';
const LEFT_CURLY_CHAR = '{';
const LEFT_PARENTHESIS_CHAR = '(';
const NEWLINE_CHAR = /^[\r\n]$/;
const NUMBER_START_CHAR = /^[0-9-+]$/;
const PERIOD_CHAR = '.';
const QUOTE_CHAR = /^["']$/;
const RIGHT_BRACKET_CHAR = ']';
const RIGHT_CURLY_CHAR = '}';
const RIGHT_PARENTHESIS_CHAR = ')';
const SIGN_CHAR = /^[-+]$/;
const SPACE_OR_HASH_CHAR = /^[\s#]$/;
const U_CHAR = 'u';
const ZERO_CHAR = '0';

export class KjouParser {
  private readonly scanner: KjouScanner;

  constructor(data: string) {
    this.scanner = new KjouScanner(data);
  }

  parseArray() {
    const array: KjouValue[] = [];

    this.scanner.consume();
    this.parseSpace();

    while (!this.scanner.sees(RIGHT_BRACKET_CHAR)) {
      const node = this.parseValue();
      array.push(node);
      this.parseSpace();

      if (this.scanner.sees(COMMA_CHAR)) {
        this.scanner.consume();
        this.parseSpace();
      }
    }

    this.scanner.one(RIGHT_BRACKET_CHAR);

    return array;
  }

  parseChild() {
    if (this.scanner.sees(QUOTE_CHAR)) {
      return this.parseString();
    }

    return this.parseNode();
  }

  parseChildren() {
    const children: KjouChild[] | null = [];

    this.scanner.consume();
    this.parseSpace();

    while (!this.scanner.sees(RIGHT_CURLY_CHAR)) {
      const node = this.parseChild();
      children.push(node);
      this.parseSpace();
    }

    this.scanner.one(RIGHT_CURLY_CHAR);

    return children;
  }

  parseDocument() {
    this.parseSpace();

    const nodes: KjouNode[] = [];

    while (!this.scanner.isDone()) {
      const node = this.parseNode();
      nodes.push(node);
    }

    return nodes;
  }

  parseEnum() {
    const name = this.parseIdentifier();
    switch (name) {
      case 'false':
        return false;
      case 'null':
        return null;
      case 'true':
        return true;
      default:
        return name;
    }
  }

  parseEscapedCharacter(character: string) {
    switch (character) {
      case '"':
        return '"';
      case "'":
        return "'";
      case '\\':
        return '\\';
      case '/':
        return '/';
      case 'b':
        return '\b';
      case 'f':
        return '\f';
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      default:
        return '';
    }
  }

  parseIdentifier() {
    let name = this.scanner.one(IDENTIFIER_CHAR);

    while (this.scanner.sees(IDENTIFIER_CHAR)) {
      name += this.scanner.consume();
    }

    return name;
  }

  parseInteger() {
    let value = '';

    if (this.scanner.sees(ZERO_CHAR)) {
      value += this.scanner.consume();

      if (this.scanner.sees(DECIMAL_DIGIT_CHAR)) {
        throw this.scanner.createError();
      }
    } else {
      value += this.scanner.one(DECIMAL_DIGIT_CHAR);

      while (this.scanner.sees(DECIMAL_DIGIT_CHAR)) {
        value += this.scanner.consume();
      }
    }

    return value;
  }

  parseKey() {
    if (this.scanner.sees(QUOTE_CHAR)) {
      return this.parseString();
    }

    return this.parseIdentifier();
  }

  parseNode(): KjouNode {
    const name = this.parseIdentifier();
    let attributes: KjouObject | null = null;
    let children: KjouChild[] | null = null;

    this.parseSpace();

    if (this.scanner.sees(LEFT_PARENTHESIS_CHAR)) {
      attributes = this.parseProperties(RIGHT_PARENTHESIS_CHAR);
    }

    if (this.scanner.sees(LEFT_CURLY_CHAR)) {
      children = this.parseChildren();
    }

    this.parseSpace();

    return new KjouNode(name, attributes, children);
  }

  parseNumber() {
    let value = '';

    if (this.scanner.sees(SIGN_CHAR)) {
      value += this.scanner.consume();
    }

    value += this.parseInteger();

    if (this.scanner.sees(PERIOD_CHAR)) {
      value += this.scanner.consume();
      value += this.scanner.one(DECIMAL_DIGIT_CHAR);

      while (this.scanner.sees(DECIMAL_DIGIT_CHAR)) {
        value += this.scanner.consume();
      }
    }

    if (this.scanner.sees(E_CHAR)) {
      value += this.scanner.consume();
      value += this.parseInteger();

      if (this.scanner.sees(PERIOD_CHAR)) {
        throw this.scanner.createError();
      }
    }

    return Number(value);
  }

  parseObject() {
    this.parseSpace();

    return this.parseProperties(RIGHT_CURLY_CHAR);
  }

  parseProperties(closeCharacter: string) {
    const properties: KjouObject = {};

    this.scanner.consume();
    this.parseSpace();

    while (!this.scanner.sees(closeCharacter)) {
      this.parseProperty(properties);

      if (this.scanner.sees(COMMA_CHAR)) {
        this.scanner.consume();
        this.parseSpace();
      }
    }

    this.scanner.one(closeCharacter);
    this.parseSpace();

    return properties;
  }

  parseProperty(object: Record<string, unknown>) {
    const key = this.parseKey();
    let value: KjouValue;

    this.parseSpace();

    if (this.scanner.sees(COLON_CHAR)) {
      this.scanner.consume();
      this.parseSpace();

      value = this.parseValue();

      this.parseSpace();
    }

    object[key] = value;
  }

  parseSpace() {
    while (this.scanner.sees(SPACE_OR_HASH_CHAR)) {
      if (this.scanner.sees(HASH_CHAR)) {
        this.scanner.consume();

        while (!this.scanner.sees(NEWLINE_CHAR)) {
          this.scanner.consume();
        }
      } else {
        this.scanner.consume();
      }
    }
  }

  parseString() {
    const quoteCharacter = this.scanner.one(QUOTE_CHAR);
    let value = '';

    while (!this.scanner.sees(quoteCharacter)) {
      const isEscaped = this.scanner.sees(ESCAPE_CHAR);
      if (isEscaped) {
        this.scanner.consume();

        const escapedCharacter = this.scanner.one(ESCAPABLE_CHAR);
        if (escapedCharacter === U_CHAR) {
          const charCode = parseInt(
            this.scanner.one(HEX_CHAR) +
              this.scanner.one(HEX_CHAR) +
              this.scanner.one(HEX_CHAR) +
              this.scanner.one(HEX_CHAR),
            16,
          );
          value += String.fromCharCode(charCode);
        } else {
          value += this.parseEscapedCharacter(escapedCharacter);
        }
      } else {
        value += this.scanner.consume();
      }
    }

    this.scanner.one(quoteCharacter);
    this.parseSpace();

    return value;
  }

  parseValue(): KjouValue {
    this.parseSpace();

    if (this.scanner.sees(QUOTE_CHAR)) {
      return this.parseString();
    } else if (this.scanner.sees(LEFT_BRACKET_CHAR)) {
      return this.parseArray();
    } else if (this.scanner.sees(LEFT_CURLY_CHAR)) {
      return this.parseObject();
    } else if (this.scanner.sees(NUMBER_START_CHAR)) {
      return this.parseNumber();
    }

    return this.parseEnum();
  }
}
