import { testKjou } from '../kjou/test';

void Promise.all([testKjou()]).then(() => {
  console.info('All tests passed.');
});
