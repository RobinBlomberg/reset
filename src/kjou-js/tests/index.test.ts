import { testJsToKjouTransformer } from './js-to-kjou-transformer.test';
import { testKjouToJsTransformer } from './kjou-to-js-transformer.test';

export const testKjouJs = () => {
  testKjouToJsTransformer();
  testJsToKjouTransformer();
};
