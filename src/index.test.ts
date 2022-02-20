import { testKjouCssCompiler } from './kjou-css-compiler/tests/index.test';
import { testKjouHtmlCompiler } from './kjou-html-compiler/tests/index.test';
import { testKjouJs } from './kjou-js/tests/index.test';
import { testKjou } from './kjou/tests/index.test';

(async () => {
  await testKjou();
  testKjouCssCompiler();
  testKjouHtmlCompiler();
  testKjouJs();

  console.info('All tests passed.');
})();
