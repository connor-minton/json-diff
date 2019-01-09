const SimpleFormatter = require('./formatters/simple-formatter');

const DEFAULTS = {
  useColor: true,
  Formatter: SimpleFormatter,
  debug: false,
  file1: undefined,
  file2: undefined,
  showDeletions: true,
  showInsertions: true,
  showMutations: true
};

class Config {
  constructor(...overrides) {
    this.values = Object.assign({}, ...overrides);
  }

  mergeCliArgs(args) {
    const overrides = {};
    if (args.deleted || args.changed || args.inserted) {
      overrides.showDeletions = args.deleted;
      overrides.showInsertions = args.inserted;
      overrides.showMutations = args.changed;
    }
    overrides.useColor = args.color;
    overrides.file1 = args.file1;
    overrides.file2 = args.file2;
    setFormatter(overrides, args);

    return this.merge(overrides);
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

// -----------------------------------------------------------------------------

function setFormatter(obj, cliArgs) {
  const name = cliArgs.format || 'simple';
  try {
    obj.Formatter = require(`./formatters/${name}-formatter`);
  }
  catch (e) {
    throw new Error(`The formatter \`${name}-formatter\` does not exist.`);
  }
}
