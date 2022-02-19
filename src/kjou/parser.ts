import { KjouNode } from './node';
import { KjouScanner } from './scanner';
import { KjouChild, KjouProps, KjouValue } from './types';

const COLON_CHAR = ':';
const COMMA_CHAR = ',';
const DECIMAL_DIGIT_CHAR = /^[0-9]$/;
const DOUBLE_QUOTE_CHAR = '"';
const E_CHAR = /^[eE]$/;
const ESCAPABLE_CHAR = /^[u"'\\/bfnrt]$/;
const ESCAPE_CHAR = '\\';
const HASH_CHAR = '#';
const HEX_CHAR = /^[0-9A-Fa-f]$/;
const IDENTIFIER_CHAR = /^[^\s':;{}()\],]$/;
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
const SEMI_COLON_CHAR = ';';
const SIGN_CHAR = /^[-+]$/;
const SINGLE_QUOTE_CHAR = "'";
const SPACE_OR_HASH_CHAR = /^[\s#]$/;
const U_CHAR = 'u';
const ZERO_CHAR = '0';

const invalidKeyError = new SyntaxError(
  'Expected key to be of type "Node | string | number"',
);

export class KjouParser {
  private readonly scanner: KjouScanner;

  constructor(data: string) {
    this.scanner = new KjouScanner(data);
  }

  private isValidKey(value: KjouValue) {
    return value instanceof KjouNode || !(value instanceof Object);
  }

  parseAliasedNode() {
    const name = this.parseName();

    this.parseSpace();

    if (this.scanner.sees(COLON_CHAR)) {
      this.scanner.consume();
      this.parseSpace();
      return this.parseNode({ alias: name });
    }

    return this.parseNode({ name });
  }

  parseArray() {
    this.scanner.consume();
    this.parseSpace();

    const array: KjouValue[] = [];

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
    return this.scanner.sees(SINGLE_QUOTE_CHAR)
      ? this.parseString(SINGLE_QUOTE_CHAR)
      : this.parseAliasedNode();
  }

  parseChildren() {
    this.scanner.consume();
    this.parseSpace();

    const children: KjouChild[] | null = [];

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

    const values: KjouValue[] = [];

    while (!this.scanner.isDone()) {
      const value = this.parseValue();
      values.push(value);
      this.parseSpace();
    }

    return values;
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
        return this.parseNode({ name });
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

  parseName() {
    return this.scanner.sees(DOUBLE_QUOTE_CHAR)
      ? this.parseString(DOUBLE_QUOTE_CHAR)
      : this.parseIdentifier();
  }

  parseNode({ alias, name }: { alias?: string; name?: string } = {}) {
    if (!name) {
      name = this.parseName();
    }

    this.parseSpace();

    let props: KjouProps | undefined;

    if (this.scanner.sees(LEFT_PARENTHESIS_CHAR)) {
      props = this.parseProps(RIGHT_PARENTHESIS_CHAR, true);
      this.parseSpace();
    }

    let children: KjouChild[] | undefined;

    if (this.scanner.sees(LEFT_CURLY_CHAR)) {
      children = this.parseChildren();
    } else if (this.scanner.sees(SEMI_COLON_CHAR)) {
      this.scanner.consume();
    }

    return new KjouNode({
      alias,
      children,
      name,
      props,
    });
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

    return this.parseProps(RIGHT_CURLY_CHAR, false).attributes;
  }

  parseProps(closeCharacter: string, parseArgs: boolean) {
    const props: KjouProps = {
      args: [],
      attributes: {},
    };

    this.scanner.consume();
    this.parseSpace();

    while (!this.scanner.sees(closeCharacter)) {
      const value = this.parseValue();

      this.parseSpace();

      const key = value instanceof KjouNode ? value.name : String(value);

      if (this.scanner.sees(COLON_CHAR)) {
        this.scanner.consume();
        this.parseSpace();

        if (!this.isValidKey(key)) {
          throw invalidKeyError;
        }

        props.attributes[key] = this.parseValue();
      } else if (parseArgs) {
        props.args.push(value);
      } else {
        if (!this.isValidKey(key)) {
          throw invalidKeyError;
        }

        props.attributes[key] = undefined;
      }

      this.parseSpace();

      if (this.scanner.sees(COMMA_CHAR)) {
        this.scanner.consume();
        this.parseSpace();
      }
    }

    this.scanner.one(closeCharacter);

    return props;
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

  parseString(quoteCharacter: string | RegExp = QUOTE_CHAR) {
    this.scanner.consume();

    let value = '';

    while (!this.scanner.sees(quoteCharacter)) {
      const isEscaped = this.scanner.sees(ESCAPE_CHAR);
      if (isEscaped) {
        this.scanner.consume();

        const escapedCharacter = this.scanner.one(ESCAPABLE_CHAR);
        if (escapedCharacter === U_CHAR) {
          const hex =
            this.scanner.one(HEX_CHAR) +
            this.scanner.one(HEX_CHAR) +
            this.scanner.one(HEX_CHAR) +
            this.scanner.one(HEX_CHAR);
          const charCode = parseInt(hex, 16);
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
    if (this.scanner.sees(QUOTE_CHAR)) {
      return this.parseString(QUOTE_CHAR);
    } else if (this.scanner.sees(LEFT_BRACKET_CHAR)) {
      return this.parseArray();
    } else if (this.scanner.sees(LEFT_CURLY_CHAR)) {
      return this.parseObject();
    } else if (this.scanner.sees(NUMBER_START_CHAR)) {
      const number = this.parseNumber();
      return this.scanner.sees(IDENTIFIER_CHAR)
        ? `${number}${this.parseIdentifier()}`
        : number;
    }

    return this.parseEnum();
  }
}
