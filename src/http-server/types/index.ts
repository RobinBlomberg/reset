export type HttpServerOptions = {
  methods: MethodCollection;
  port: number;
};

export type MethodCollection = Record<string, Function>;
