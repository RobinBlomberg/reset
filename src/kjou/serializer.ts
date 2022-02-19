import { KjouNode } from './node';
import { KjouObject, KjouValue } from './types';

const SINGLE_QUOTE_OR_ESCAPE_REGEXP = /(['\\])/g;

export class KjouSerializer {
  serializeArray(node: KjouValue[]) {
    let kjou = '[';

    for (let i = 0; i < node.length; i++) {
      if (i >= 1) {
        kjou += ',';
      }

      kjou += this.serializeValue(node[i]);
    }

    kjou += ']';

    return kjou;
  }

  serializeDocument(nodes: KjouValue[]) {
    let kjou = '';

    for (const node of nodes) {
      kjou += `${this.serializeValue(node)};`;
    }

    return kjou;
  }

  serializeNode(node: KjouNode) {
    let kjou = node.name;

    if (node.props) {
      kjou += '(';

      let i = 0;

      for (; i < node.props.args.length; i++) {
        if (i >= 1) {
          kjou += ',';
        }

        const arg = node.props.args[i]!;
        kjou += this.serializeValue(arg);
      }

      for (const key in node.props.attributes) {
        if (Object.prototype.hasOwnProperty.call(node.props.attributes, key)) {
          if (i >= 1) {
            kjou += ',';
          }

          const value = node.props.attributes[key];
          kjou += `${key}:${this.serializeValue(value)}`;
          i++;
        }
      }

      kjou += ')';
    }

    if (node.children) {
      kjou += '{';

      for (const child of node.children) {
        kjou += `${this.serializeValue(child)};`;
      }

      kjou += '}';
    }

    return kjou;
  }

  serializeObject(node: KjouObject) {
    let kjou = '{';
    let i = 0;

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        if (i >= 1) {
          kjou += ',';
        }

        const value = node[key];
        kjou += `${key}:${this.serializeValue(value)}`;
        i++;
      }
    }

    kjou += '}';

    return kjou;
  }

  serializeString(node: string) {
    return `'${node.replace(SINGLE_QUOTE_OR_ESCAPE_REGEXP, '\\$1')}'`;
  }

  serializeValue(node: KjouValue) {
    if (typeof node === 'number') {
      return Object.is(node, -0) ? '-0' : String(node);
    } else if (typeof node === 'string') {
      return this.serializeString(node);
    } else if (node instanceof KjouNode) {
      return this.serializeNode(node);
    } else if (Array.isArray(node)) {
      return this.serializeArray(node);
    } else if (node instanceof Object) {
      return this.serializeObject(node);
    }

    return String(node);
  }
}
