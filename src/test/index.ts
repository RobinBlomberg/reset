import { testKjouHtmlCompiler } from '../kjou-html-compiler/test';
import { testKjou } from '../kjou/test';

void Promise.all([testKjou(), testKjouHtmlCompiler()]).then(() => {
  console.info('All tests passed.');
});
