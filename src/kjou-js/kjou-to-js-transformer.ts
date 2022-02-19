import { KjouNode } from '../kjou/node';
import { KjouObject, KjouValue } from '../kjou/types';
import { CONSTRUCTORS_BY_NAME } from './constructor';

export class KjouToJsTransformer {
  transformArray(node: KjouValue[]) {
    const output: unknown[] = [];

    for (const item of node) {
      output.push(this.transformValue(item));
    }

    return output;
  }

  transformNode(node: KjouNode) {
    const args: any[] = [];

    if (node.props?.args) {
      for (const arg of node.props.args) {
        args.push(this.transformValue(arg));
      }
    }

    const Constructor = CONSTRUCTORS_BY_NAME[node.name];
    if (Constructor) {
      return new Constructor(...args);
    }

    return node.name;
  }

  transformObject(node: KjouObject) {
    const output: Record<string | number | symbol, unknown> = {};

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const value = node[key];
        output[key] = this.transformValue(value);
      }
    }

    return output;
  }

  transformValue(node: KjouValue) {
    if (Array.isArray(node)) {
      return this.transformArray(node);
    } else if (node instanceof KjouNode) {
      return this.transformNode(node);
    } else if (node instanceof Object) {
      return this.transformObject(node);
    }

    return node;
  }
}
