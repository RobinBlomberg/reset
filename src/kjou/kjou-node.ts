import { KjouChild, KjouObject } from './types';

export class KjouNode {
  readonly attributes: KjouObject;
  readonly children: KjouChild[] | null;
  readonly name: string;

  constructor(
    name: string,
    attributes: KjouObject,
    children: KjouChild[] | null,
  ) {
    this.name = name;
    this.attributes = attributes;
    this.children = children;
  }

  toHtml() {
    let html = `<${this.name}`;

    for (const name in this.attributes) {
      if (Object.prototype.hasOwnProperty.call(this.attributes, name)) {
        const value = this.attributes[name];
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

    if (this.children) {
      for (const child of this.children) {
        html += typeof child === 'string' ? child : child.toHtml();
      }

      html += `</${this.name}>`;
    }

    return html;
  }
}
