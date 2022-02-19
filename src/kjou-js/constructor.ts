export const CONSTRUCTORS_BY_NAME: Record<string, any> = {
  Boolean,
  Date,
  Error,
  Function,
  Map,
  RegExp,
  Set,
  String,
};

export const CONSTRUCTORS = new Set(Object.values(CONSTRUCTORS_BY_NAME));
