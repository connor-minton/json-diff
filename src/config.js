const SimpleFormatter = require('./formatters/simple-formatter');

const DEFAULTS = {
  useColor: true,
  Formatter: SimpleFormatter,
  debug: false
};

class Config {
  constructor(...overrides) {
    this.values = Object.assign({}, ...overrides);
  }

  useArgv(argv) {
    const newOptions = {};
    newOptions.useColor = argv.color;
    newOptions.file1 = argv.file1;
    newOptions.file2 = argv.file2;

    return this.merge(newOptions);
  }

  merge(...overrides) {
    Object.assign(this.values, ...overrides);
    return this;
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    this.values[key] = value;
    return this;
  }
}

module.exports = new Config(DEFAULTS);
