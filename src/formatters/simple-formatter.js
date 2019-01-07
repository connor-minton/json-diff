const Formatter = require('./formatter');
const chalk = require('chalk');
const { INSERTION, MUTATION, DELETION } = require('../change').ChangeTypes;
const { getSimpleType } = require('../util');

const PATH_SPECIAL_CHARS = '\\[].'

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
      , colon = ':'
      , pathStr = chalk.green.bold(this._getPathString(change.paths));

    return `${changeType} ${pathStr} ${colon} ${toStr}`;
  }

  _getKeyRemovedString(change) {
    const chalk = this.chalk
      , changeType = chalk.red.bold('-')
      , pathStr = chalk.red.bold(this._getPathString(change.paths));

    return `${changeType} ${pathStr}`;
  }

  _getValueChangedString(change) {
    const chalk = this.chalk
      , fromStr = chalk.red(this._getValueString(change.from))
      , changeType = chalk.bold('c')
      , colon = ':'
      , arrow = '->'
      , toStr = chalk.green(this._getValueString(change.to))
      , pathStr = chalk.bold(this._getPathString(change.paths));

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
    let pathString = '';
    for (let path of paths) {
      if (getSimpleType(path) === 'number')
        pathString += `[${path}]`;
      else
        pathString += `.${this._escapeKey(path)}`;
    }
    return pathString;
  }

  _escapeKey(key) {
    let newKey = '';
    for (let c of key) {
      if (PATH_SPECIAL_CHARS.includes(c))
        newKey += '\\';
      newKey += c;
    }
    return newKey;
  }
}

module.exports = SimpleFormatter;
