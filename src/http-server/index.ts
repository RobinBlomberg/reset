import http from 'http';
import { Kjou, KjouNode } from 'kjou';
import { KjouJs, KjouToJsTransformer } from 'kjou-js';
import { HttpServerOptions } from './types';

export class HttpServer {
  private readonly kjouToJsTransformer = new KjouToJsTransformer();
  private readonly port: number;
  private readonly server: http.Server;

  constructor(options: HttpServerOptions) {
    this.port = options.port;

    this.server = http.createServer(async (req, res) => {
      if (req.method === 'POST') {
        const requestBody = await this.readRequestBody(req);
        const node = Kjou.parseValue(requestBody);

        if (!(node instanceof KjouNode)) {
          return res.end();
        }

        const methodName = node.name;
        const method = options.methods[methodName];

        if (!method) {
          return res.end(`ReferenceError('${methodName} is not defined')`);
        }

        const kjouArgs = node.props?.args ?? [];
        const jsArgs = this.kjouToJsTransformer.transformArray(kjouArgs);
        const returnee = method?.call(node, ...jsArgs);
        const responseBody = KjouJs.serialize(returnee, { pretty: true });
        return res.end(responseBody);
      }

      res.statusCode = 405;
      return res.end();
    });
  }

  private readRequestBody(req: http.IncomingMessage) {
    return new Promise<string>((resolve, reject) => {
      const buffers: Buffer[] = [];

      req.on('data', (buffer) => {
        buffers.push(buffer);
      });

      req.on('end', () => {
        resolve(Buffer.concat(buffers).toString());
      });

      req.on('error', (error) => {
        reject(error);
      });
    });
  }

  start() {
    this.server.listen(this.port);
  }

  stop() {
    this.server.close();
  }
}
