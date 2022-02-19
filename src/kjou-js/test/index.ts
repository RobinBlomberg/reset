import { testJsToKjouTransformer } from './js-to-kjou-transformer.test';
import { testKjouToJsTransformer } from './kjou-to-js-transformer.test';

export const testKjouJs = async () => {
  await Promise.all([testKjouToJsTransformer(), testJsToKjouTransformer()]);
};
