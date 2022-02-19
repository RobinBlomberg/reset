import { getConstructor } from '../kjou/get-constructor';
import { KjouNode } from '../kjou/node';
import { KjouObject, KjouValue } from '../kjou/types';

export class JsToKjouTransformer {
  transformArray(node: unknown[]) {
    const output: KjouValue[] = [];

    for (const item of node) {
      output.push(this.transformValue(item));
    }

    return output;
  }

  transformObject(node: Record<string | number | symbol, unknown>) {
    const ctor = getConstructor(node);

    if (ctor) {
      return new KjouNode({
        name: node.constructor.name,
        props: {
          args: this.transformArray(ctor.args),
        },
      });
    }

    const output: KjouObject = {};

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const value = node[key];
        output[key] = this.transformValue(value);
      }
    }

    return output;
  }

  transformValue(node: unknown): KjouValue {
    if (Array.isArray(node)) {
      return this.transformArray(node);
    } else if (node instanceof Object) {
      return this.transformObject(
        node as Record<string | number | symbol, unknown>,
      );
    }

    const type = typeof node;
    switch (type) {
      case 'boolean':
      case 'number':
      case 'string':
        return node as boolean | number | string;
      default:
        return (node ?? undefined) as null | undefined;
    }
  }
}
