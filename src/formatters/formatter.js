class Formatter {
  constructor(config={}) {
    this.options = Object.assign({}, config);
  }

  format(changes) {
    return '~~~Do not use Formatter directly. Extend Formatter and override `format()`.~~~';
  }
}

module.exports = Formatter;
