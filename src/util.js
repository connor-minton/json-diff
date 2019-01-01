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
    if (c === '\\' || c === '.')
      newKey += '\\';
    newKey += c;
  }
  return newKey
}

function getPathString(paths) {
  let pathString = '.';
  if (paths) {
    for (let p of paths) {
      pathString += escapedKey(p);
    }
  }
  return pathString;
}

function getValueChangedString(fromPaths, fromVal, toVal) {
  return `${getPathString(fromPaths)} : changed from ${JSON.stringify(fromVal)} to ${JSON.stringify(toVal)}`;
}

function getKeyAddedString(fromPaths, toVal) {
  return `${getPathString(fromPaths)} : key added with value ${JSON.stringify(toVal)}`;
}

function getKeyRemovedString(fromPaths, fromVal) {
  return `${getPathString(fromPaths)} : key removed with value ${JSON.stringify(fromVal)}`;
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

module.exports = {
  JsonDiffError,
  NotComparableError,
  InvalidJsonError,
  getSimpleType,
  getValueChangedString,
  getKeyAddedString,
  getKeyRemovedString,
  assertComparable,
  parseJsonOrThrow
};
