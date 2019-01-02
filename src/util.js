const chalk = require('chalk');

class JsonDiffError extends Error { }
class NotComparableError extends JsonDiffError { }
class InvalidJsonError extends JsonDiffError { }

function getSimpleType(thing) {
  const typeOf = typeof thing;
  if (thing === null)
    return 'null';
  if (typeOf === 'string' || thing instanceof String)
    return 'string';
  if (typeOf === 'number' || thing instanceof Number)
    return 'number';
  if (typeOf === 'undefined')
    return 'undefined';
  if (Array.isArray(thing))
    return 'array';
  return 'object';
}

function escapedKey(key) {
  let newKey = '';
  for (let c of key) {
    if (c === '.')
      newKey += '(.)';
    else
      newKey += c;
  }
  return newKey
}

function getPathString(paths) {
  let pathString = '';
  if (paths.length > 0) {
    for (let p of paths) {
      pathString += '.' + escapedKey(p);
    }
  }
  else
    pathString = '.';

  return pathString;
}

function getValueString(value) {
  const type = getSimpleType(value);
  if (type === 'object')
    return `object[${Object.keys(value).length}]`;
  else if (type === 'array')
    return `array[${value.length}]`;
  else
    return JSON.stringify(value);
}

function getValueChangedString(fromPaths, fromVal, toVal) {
  const fromStr = chalk.red(getValueString(fromVal))
    , toStr = chalk.green(getValueString(toVal))
    , pathStr = getPathString(fromPaths);

  return chalk`{bold c} ${pathStr} {bold :} ${fromStr} {bold ->} ${toStr}`;
}

function getKeyAddedString(fromPaths, toVal) {
  const toStr = getValueString(toVal)
    , status = chalk.green.bold('+');
  return status + chalk.green(` ${getPathString(fromPaths)} : ${toStr}`);
}

function getKeyRemovedString(fromPaths) {
  const status = chalk.red.bold('-');
  return status + chalk.red(` ${getPathString(fromPaths)}`);
}

function assertComparable(aType, bType) {
  if (aType === 'undefined' || bType === 'undefined')
    throw new NotComparableError('Cannot compute the diff of `undefined`');
  if (aType === 'function' || bType === 'function')
    throw new NotComparableError('Cannot compute the diff of `function`');
}

function parseJsonOrThrow(json, label) {
  try {
    return JSON.parse(json);
  }
  catch (e) {
    throw new InvalidJsonError(`\`${label}\` has invalid JSON`);
  }
}

function promisify(asyncFunc) {
  return (...params) => {
    return new Promise((resolve, reject) => {
      asyncFunc(...params, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}

module.exports = {
  JsonDiffError,
  NotComparableError,
  InvalidJsonError,
  getSimpleType,
  getValueChangedString,
  getKeyAddedString,
  getKeyRemovedString,
  assertComparable,
  parseJsonOrThrow,
  promisify
};
