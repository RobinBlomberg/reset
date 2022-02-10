import { KjouNode } from './kjou-node';
import { Parser } from './parser';
import { KjouChild, KjouObject, KjouValue } from './types';

const COLON_CHAR = ':';
const COMMA_CHAR = ',';
const DECIMAL_DIGIT_CHAR = /^[0-9]$/;
const E_CHAR = /^[eE]$/;
const ESCAPABLE_CHAR = /^[u"'\\/bfnrt]$/;
const ESCAPE_CHAR = '\\';
const HASH_CHAR = '#';
const HEX_CHAR = /^[0-9A-Fa-f]$/;
const IDENTIFIER_CHAR = /^[^\s{}()[\]:,]$/;
const IDENTIFIER_START_CHAR = /^[^\s{}()[\]:,0-9]$/;
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
const SPACE_CHAR = /^[\s#]$/;
const U_CHAR = 'u';
const ZERO_CHAR = '0';

export class KjouParser {
  private readonly parser: Parser;

  constructor(data: string) {
    this.parser = new Parser(data);
  }

  private parseArray() {
    const array: KjouValue[] = [];

    this.parser.consume();
    this.parseSpace();

    while (!this.parser.sees(RIGHT_BRACKET_CHAR)) {
      const node = this.parseValue();
      array.push(node);
      this.parseSpace();

      if (this.parser.sees(COMMA_CHAR)) {
        this.parser.consume();
        this.parseSpace();
      }
    }

    this.parser.one(RIGHT_BRACKET_CHAR);

    return array;
  }

  private parseChild() {
    if (this.parser.sees(QUOTE_CHAR)) {
      return this.parseString();
    }

    return this.parseNode();
  }

  private parseChildren() {
    const children: KjouChild[] | null = [];

    this.parser.consume();
    this.parseSpace();

    while (!this.parser.sees(RIGHT_CURLY_CHAR)) {
      const node = this.parseChild();
      children.push(node);
    }

    this.parser.one(RIGHT_CURLY_CHAR);

    return children;
  }

  private parseEscapedCharacter(character: string) {
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

  private parseIdentifier() {
    let name = this.parser.one(IDENTIFIER_START_CHAR);

    while (this.parser.sees(IDENTIFIER_CHAR)) {
      name += this.parser.consume();
    }

    return name;
  }

  private parseIdentifierOrScalar() {
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

  private parseInteger() {
    let value = '';

    if (this.parser.sees(ZERO_CHAR)) {
      value += this.parser.consume();
    } else {
      value += this.parser.one(DECIMAL_DIGIT_CHAR);

      while (this.parser.sees(DECIMAL_DIGIT_CHAR)) {
        value += this.parser.consume();
      }
    }

    return value;
  }

  private parseNode(): KjouNode {
    const name = this.parseIdentifier();
    let attributes: KjouObject = {};
    let children: KjouChild[] | null = null;

    this.parseSpace();

    if (this.parser.sees(LEFT_PARENTHESIS_CHAR)) {
      attributes = this.parseProperties(RIGHT_PARENTHESIS_CHAR);
    }

    if (this.parser.sees(LEFT_CURLY_CHAR)) {
      children = this.parseChildren();
    }

    this.parseSpace();

    return new KjouNode(name, attributes, children);
  }

  private parseNumber() {
    let value = '';

    if (this.parser.sees(SIGN_CHAR)) {
      value += this.parser.consume();
    }

    value += this.parseInteger();

    if (this.parser.sees(PERIOD_CHAR)) {
      value += this.parser.consume();
      value += this.parser.one(DECIMAL_DIGIT_CHAR);

      while (this.parser.sees(DECIMAL_DIGIT_CHAR)) {
        value += this.parser.consume();
      }
    }

    if (this.parser.sees(E_CHAR)) {
      value += this.parser.consume();
      value += this.parseInteger();
    }

    return Number(value);
  }

  private parseObject() {
    return this.parseProperties(RIGHT_CURLY_CHAR);
  }

  private parseProperties(closeCharacter: string) {
    const properties: KjouObject = {};

    this.parser.consume();
    this.parseSpace();

    while (!this.parser.sees(closeCharacter)) {
      this.parseProperty(properties);

      if (this.parser.sees(COMMA_CHAR)) {
        this.parser.consume();
        this.parseSpace();
      }
    }

    this.parser.one(closeCharacter);
    this.parseSpace();

    return properties;
  }

  private parseProperty(object: Record<string, unknown>) {
    const key = this.parseIdentifier();
    let value: KjouValue;

    this.parseSpace();

    if (this.parser.sees(COLON_CHAR)) {
      this.parser.consume();
      this.parseSpace();

      value = this.parseValue();

      this.parseSpace();
    }

    object[key] = value;
  }

  private parseSpace() {
    while (this.parser.sees(SPACE_CHAR)) {
      if (this.parser.sees(HASH_CHAR)) {
        this.parser.consume();

        while (!this.parser.sees(NEWLINE_CHAR)) {
          this.parser.consume();
        }
      } else {
        this.parser.consume();
      }
    }
  }

  private parseString() {
    const quoteCharacter = this.parser.one(QUOTE_CHAR);
    let value = '';

    while (!this.parser.sees(quoteCharacter)) {
      const isEscaped = this.parser.sees(ESCAPE_CHAR);
      if (isEscaped) {
        this.parser.consume();

        const escapedCharacter = this.parser.one(ESCAPABLE_CHAR);
        if (escapedCharacter === U_CHAR) {
          const charCode = parseInt(
            this.parser.one(HEX_CHAR) +
              this.parser.one(HEX_CHAR) +
              this.parser.one(HEX_CHAR) +
              this.parser.one(HEX_CHAR),
            16,
          );
          value += String.fromCharCode(charCode);
        } else {
          value += this.parseEscapedCharacter(escapedCharacter);
        }
      } else {
        value += this.parser.consume();
      }
    }

    this.parser.one(quoteCharacter);
    this.parseSpace();

    return value;
  }

  private parseValue() {
    if (this.parser.sees(QUOTE_CHAR)) {
      return this.parseString();
    } else if (this.parser.sees(LEFT_BRACKET_CHAR)) {
      return this.parseArray();
    } else if (this.parser.sees(LEFT_CURLY_CHAR)) {
      return this.parseObject();
    } else if (this.parser.sees(NUMBER_START_CHAR)) {
      return this.parseNumber();
    }

    return this.parseIdentifierOrScalar();
  }

  parse() {
    this.parseSpace();

    const nodes: KjouNode[] = [];

    while (!this.parser.isDone()) {
      const node = this.parseNode();
      nodes.push(node);
    }

    return nodes;
  }
}
