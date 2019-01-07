class Formatter {
  constructor(config={}) {
    this.options = Object.assign({}, config);
  }

  format(change) {
    return JSON.stringify(change);
  }
}

module.exports = Formatter;
