import { strictEqual } from 'assert';
import { KjouNode } from '~kjou';
import { KjouCssCompiler } from '~kjou-css-compiler';

export const testKjouCssCompiler = () => {
  strictEqual(
    new KjouCssCompiler().compile(
      new KjouNode({
        children: [
          new KjouNode({
            children: [],
            name: 'button',
            props: { attributes: { class: 'big', disabled: undefined } },
          }),
        ],
        name: '@media',
        props: { attributes: { 'min-widt': '800px' } },
      }),
    ),
    '',
  );
  strictEqual(
    new KjouCssCompiler().compile(
      new KjouNode({
        children: [
          new KjouNode({
            children: [
              new KjouNode({ alias: 'color', name: 'red' }),
              new KjouNode({
                alias: 'font-family',
                name: "'Circular Std', sans-serif",
              }),
              new KjouNode({ alias: 'cursor', name: 'pointer' }),
            ],
            name: 'button',
            props: { attributes: { class: 'big', disabled: '' } },
          }),
        ],
        name: '@media',
        props: { attributes: { 'min-width': '800px' } },
      }),
    ),
    '@media(min-width:800px){button[class="big"][disabled]{' +
      "color:red;font-family:'Circular Std', sans-serif;cursor:pointer;}}",
  );
};
