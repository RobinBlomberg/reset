import { testKjouCssCompiler } from '../kjou-css-compiler/test';
import { testKjouHtmlCompiler } from '../kjou-html-compiler/test';
import { testKjouJs } from '../kjou-js/test';
import { testKjou } from '../kjou/test/index.test';

(async () => {
  await testKjou();
  testKjouCssCompiler();
  testKjouHtmlCompiler();
  await testKjouJs();

  console.info('All tests passed.');
})();
