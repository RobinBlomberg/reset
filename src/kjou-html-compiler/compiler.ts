import { KjouNode } from '../kjou';

export class KjouHtmlCompiler {
  compile(node: KjouNode | KjouNode[]) {
    if (Array.isArray(node)) {
      let html = '';

      for (const child of node) {
        html += this.compile(child);
      }

      return html;
    }

    let html = `<${node.name}`;

    for (const name in node.attributes) {
      if (Object.prototype.hasOwnProperty.call(node.attributes, name)) {
        const value = node.attributes[name];
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === undefined
        ) {
          html += ` ${name}`;

          if (value !== undefined) {
            html += `=${JSON.stringify(String(value))}`;
          }
        }
      }
    }

    html += '>';

    if (node.children) {
      for (const child of node.children) {
        html += typeof child === 'string' ? child : this.compile(child);
      }

      html += `</${node.name}>`;
    }

    return html;
  }
}
