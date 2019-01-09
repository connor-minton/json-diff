const Formatter = require('./formatter');
const chalk = require('chalk');
const { INSERTION, MUTATION, DELETION } = require('../change').ChangeTypes;
const { getSimpleType } = require('../util');

const PATH_SPECIAL_CHARS = new Set(' []."');

const DEFAULTS = {
  useColor: true,
  showInsertions: true,
  showDeletions: true,
  showMutations: true
};

class SimpleFormatter extends Formatter {
  constructor(options={}) {
    super();
    this.options = Object.assign({}, DEFAULTS, options);
    this.chalk = new chalk.constructor({enabled: this.options.useColor});
  }

  format(changes) {
    const changeStrings = [];
    for (let change of changes) {
      switch (change.type) {
        case INSERTION:
          if (this.options.showInsertions)
            changeStrings.push(this._getKeyAddedString(change));
          break;
        case DELETION:
          if (this.options.showDeletions)
            changeStrings.push(this._getKeyRemovedString(change));
          break;
        case MUTATION:
          if (this.options.showMutations)
            changeStrings.push(this._getValueChangedString(change));
          break;
        default:
          throw new Error('unknown change type');
      }
    }

    return changeStrings.join('\n');
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
    for (let c of key) {
      if (PATH_SPECIAL_CHARS.has(c))
        return JSON.stringify(key);
    }
    return key;
  }
}

module.exports = SimpleFormatter;
