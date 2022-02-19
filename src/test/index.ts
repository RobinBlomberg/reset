import { testKjouCssCompiler } from '../kjou-css-compiler/test';
import { testKjouHtmlCompiler } from '../kjou-html-compiler/test';
import { testKjouJs } from '../kjou-js/test';
import { testKjou } from '../kjou/test';

void Promise.all([
  testKjouCssCompiler(),
  testKjouHtmlCompiler(),
  testKjouJs(),
  testKjou(),
]).then(() => {
  console.info('All tests passed.');
});
