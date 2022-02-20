import { KjouNode, KjouValue } from '~kjou';

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

    if (node.props) {
      for (const key in node.props.attributes) {
        if (Object.prototype.hasOwnProperty.call(node.props.attributes, key)) {
          const value = node.props.attributes[key];
          const compiledAttribute = this.compileAttribute(key, value);

          if (compiledAttribute) {
            html += ` ${compiledAttribute}`;
          }
        }
      }

      for (const arg of node.props.args) {
        const compiledArg = this.compileValue(arg);

        if (compiledArg) {
          html += ` ${compiledArg}`;
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

  compileAttribute(key: string, value: KjouValue) {
    if (value == null) {
      return '';
    }

    let html = key;

    if (value !== '') {
      html += `=${JSON.stringify(this.compileValue(value))}`;
    }

    return html;
  }

  compileValue(value: KjouValue) {
    if (value instanceof KjouNode) {
      return value.name;
    }

    if (typeof value === 'object' || value === undefined) {
      return '';
    }

    return String(value);
  }
}
