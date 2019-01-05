const Formatter = require('./formatter');
const chalk = require('chalk');
const { INSERTION, MUTATION, DELETION } = require('../change').ChangeTypes;
const { getSimpleType } = require('../util');

class SimpleFormatter extends Formatter {
  constructor(options={}) {
    super();
    const defaults = {
      useColor: true
    };
    this.options = Object.assign({}, defaults, options);
    this.chalk = new chalk.constructor({enabled: this.options.useColor});
  }

  format(changes) {
    return changes.map(change => {
      switch (change.type) {
      case INSERTION:
        return this._getKeyAddedString(change);
      case DELETION:
        return this._getKeyRemovedString(change);
      case MUTATION:
        return this._getValueChangedString(change);
      default:
        throw new Error('unknown change type');
      }
    }).join('\n');
  }

  _getKeyAddedString(change) {
    const chalk = this.chalk
      , toStr = chalk.green(this._getValueString(change.to))
      , changeType = chalk.green.bold('+')
      , colon = chalk.bold(':')
      , pathStr = chalk.green(this._getPathString(change.paths));

    return `${changeType} ${pathStr} ${colon} ${toStr}`;
  }

  _getKeyRemovedString(change) {
    const chalk = this.chalk
      , changeType = chalk.red.bold('-')
      , pathStr = chalk.red(this._getPathString(change.paths));

    return `${changeType} ${pathStr}`;
  }

  _getValueChangedString(change) {
    const chalk = this.chalk
      , fromStr = chalk.red(this._getValueString(change.from))
      , changeType = chalk.bold('c')
      , colon = chalk.bold(':')
      , arrow = chalk.bold('->')
      , toStr = chalk.green(this._getValueString(change.to))
      , pathStr = this._getPathString(change.paths);

    return `${changeType} ${pathStr} ${colon} ${fromStr} ${arrow} ${toStr}`;
  }

  _getValueString(value) {
    const type = getSimpleType(value);
    if (type === 'object')
      return `object[${Object.keys(value).length}]`;
    else if (type === 'array')
      return `array[${value.length}]`;
    else
      return JSON.stringify(value);
  }

  _getPathString(paths) {
    return '.' + paths.map(path => this._escapeKey(path)).join('.');
  }

  _escapeKey(key) {
    let newKey = '';
    for (let c of key) {
      if (c === '.' || c === '\\')
        newKey += '\\';
      newKey += c;
    }
    return newKey;
  }
}

module.exports = SimpleFormatter;
