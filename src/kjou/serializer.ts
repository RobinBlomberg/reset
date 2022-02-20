import { KjouNode } from './node';
import { KjouObject, KjouSerializerOptions, KjouValue } from './types';

const NEWLINE_REGEXP = /[\n]/;
const SINGLE_QUOTE_OR_ESCAPE_REGEXP = /(['\\])/g;

export class KjouSerializer {
  readonly pretty: boolean;

  constructor(options: KjouSerializerOptions = {}) {
    this.pretty = options.pretty ?? false;
  }

  serializeArray(node: KjouValue[], depth = 0) {
    const indent1 = '  '.repeat(depth);
    const indent2 = `${indent1}  `;
    const size = node.length;
    let body = '';

    for (let i = 0; i < node.length; i++) {
      const value = this.serializeValue(node[i], depth + 1);
      const isMultiline = size >= 2 || NEWLINE_REGEXP.test(value);

      if (this.pretty) {
        if (isMultiline) {
          body += '\n';
        }
      } else if (i >= 1) {
        body += ',';
      }

      if (this.pretty && isMultiline) {
        body += indent2;
      }

      body += value;
    }

    return this.pretty && NEWLINE_REGEXP.test(body)
      ? `[${body}\n${indent1}]`
      : `[${body}]`;
  }

  serializeAttributes(node: KjouObject, depth = 0) {
    const indent1 = '  '.repeat(depth);
    const indent2 = `${indent1}  `;
    const size = Object.values(node).length;
    let body = '';
    let i = 0;

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const value = this.serializeValue(node[key], depth + 1);
        const isMultiline = size >= 2 || NEWLINE_REGEXP.test(value);

        if (this.pretty) {
          if (isMultiline) {
            body += '\n';
          }
        } else if (i >= 1) {
          body += ',';
        }

        if (this.pretty && isMultiline) {
          body += indent2;
        }

        body += key;
        body += ':';

        if (this.pretty) {
          body += ' ';
        }

        body += value;
        i++;
      }
    }

    return this.pretty && NEWLINE_REGEXP.test(body)
      ? `${body}\n${indent1}`
      : body;
  }

  serializeDocument(nodes: KjouValue[]) {
    let kjou = '';

    for (let i = 0; i < nodes.length; i++) {
      if (this.pretty && i >= 1) {
        kjou += '\n';
      }

      kjou += this.serializeValue(nodes[i]);

      if (!this.pretty) {
        kjou += ';';
      }
    }

    return kjou;
  }

  serializeNode(node: KjouNode, depth = 0) {
    const size = node.props
      ? node.props.args.length + Object.values(node.props.attributes).length
      : 0;
    const multiline = this.pretty && size >= 2;
    const indent1 = multiline ? '  '.repeat(depth) : '';
    const indent2 = multiline ? `${indent1}  ` : '';
    const indent3 = this.pretty ? '  '.repeat(depth) : '';
    const indent4 = this.pretty ? `${indent3}  ` : '';
    let kjou = '';

    if (node.alias) {
      kjou += node.alias;
      kjou += ':';

      if (this.pretty) {
        kjou += ' ';
      }
    }

    kjou += node.name;

    if (node.props) {
      kjou += '(';

      let i = 0;

      for (; i < node.props.args.length; i++) {
        if (multiline) {
          kjou += '\n';
        } else if (!multiline && i >= 1) {
          kjou += ',';
        }

        kjou += indent2;
        kjou += this.serializeValue(node.props.args[i], depth + 1);
      }

      for (const key in node.props.attributes) {
        if (Object.prototype.hasOwnProperty.call(node.props.attributes, key)) {
          if (multiline) {
            kjou += '\n';
          } else if (!multiline && i >= 1) {
            kjou += ',';
          }

          kjou += indent2;
          kjou += key;
          kjou += ':';

          if (this.pretty) {
            kjou += ' ';
          }

          kjou += this.serializeValue(node.props.attributes[key], depth + 1);
          i++;
        }
      }

      if (multiline) {
        kjou += '\n';
        kjou += indent1;
      }

      kjou += ')';
    }

    if (node.children) {
      if (this.pretty) {
        kjou += ' ';
      }

      kjou += '{';

      for (const child of node.children) {
        if (this.pretty) {
          kjou += '\n';
          kjou += indent4;
        }

        kjou += this.serializeValue(child, depth + 1);

        if (!this.pretty) {
          kjou += ';';
        }
      }

      if (this.pretty && node.children.length >= 1) {
        kjou += '\n';
        kjou += indent3;
      }

      kjou += '}';
    }

    return kjou;
  }

  serializeObject(node: KjouObject, depth = 0) {
    const body = this.serializeAttributes(node, depth);
    return this.pretty && body && !NEWLINE_REGEXP.test(body)
      ? `{ ${body} }`
      : `{${body}}`;
  }

  serializeString(node: string) {
    return `'${node.replace(SINGLE_QUOTE_OR_ESCAPE_REGEXP, '\\$1')}'`;
  }

  serializeValue(node: KjouValue, depth = 0) {
    if (typeof node === 'number') {
      return Object.is(node, -0) ? '-0' : String(node);
    } else if (typeof node === 'string') {
      return this.serializeString(node);
    } else if (node instanceof KjouNode) {
      return this.serializeNode(node, depth);
    } else if (Array.isArray(node)) {
      return this.serializeArray(node, depth);
    } else if (node instanceof Object) {
      return this.serializeObject(node, depth);
    }

    return String(node);
  }
}
