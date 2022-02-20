import { Kjou } from 'kjou';
import { KjouSerializerOptions } from 'kjou/types';
import { JsToKjouTransformer } from './js-to-kjou-transformer';
import { KjouToJsTransformer } from './kjou-to-js-transformer';

const jsToKjouTransformer = new JsToKjouTransformer();
const kjouToJsTransformer = new KjouToJsTransformer();

export class KjouJs {
  static parseDocument(data: string) {
    return kjouToJsTransformer.transformValue(Kjou.parseDocument(data));
  }

  static parseValue(data: string) {
    return kjouToJsTransformer.transformValue(Kjou.parseValue(data));
  }

  static serialize(value: unknown, options: KjouSerializerOptions = {}) {
    return Kjou.serialize(jsToKjouTransformer.transform(value), options);
  }
}
