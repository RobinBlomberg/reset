export class KjouScanner {
  readonly data: string;
  index = 0;

  constructor(data: string) {
    this.data = data;
  }

  consume() {
    const character = this.data[this.index];
    if (!character) {
      throw new SyntaxError(`Unexpected end of input at index ${this.index}`);
    }

    this.index++;
    return character;
  }

  createError() {
    const noun = this.data[this.index]
      ? `character ${JSON.stringify(this.data[this.index])}`
      : 'end of input';
    return new SyntaxError(`Unexpected ${noun} at index ${this.index}`);
  }

  isDone() {
    return !this.data[this.index];
  }

  one(pattern: RegExp | string) {
    if (!this.sees(pattern)) {
      throw this.createError();
    }

    return this.consume();
  }

  sees(pattern: RegExp | string) {
    if (typeof pattern === 'string') {
      return this.data[this.index] === pattern;
    }

    const character = this.data[this.index];
    return !!character && pattern.test(character);
  }
}
