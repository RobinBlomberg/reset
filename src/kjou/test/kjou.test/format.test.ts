import { strictEqual } from 'assert';
import { Kjou } from '../../kjou';

strictEqual(
  Kjou.format(
    "!doctype(html);html(class:'no-js',lang:'en-US'){head{meta(charset:'utf-8');title{};};body{" +
      "'<!-- Add your site or application content here -->';" +
      "strong(a:null,class:['paragraph','text--red']){" +
      "'Hello world! This is HTML5 Boilerplate.';};};};",
  ),
  '!doctype(html)\n' +
    'html(\n' +
    "  class: 'no-js'\n" +
    "  lang: 'en-US'\n" +
    ') {\n' +
    '  head {\n' +
    "    meta(charset: 'utf-8')\n" +
    '    title {}\n' +
    '  }\n' +
    '  body {\n' +
    "    '<!-- Add your site or application content here -->'\n" +
    '    strong(\n' +
    '      a: null\n' +
    '      class: [\n' +
    "        'paragraph'\n" +
    "        'text--red'\n" +
    '      ]\n' +
    '    ) {\n' +
    "      'Hello world! This is HTML5 Boilerplate.'\n" +
    '    }\n' +
    '  }\n' +
    '}',
);
