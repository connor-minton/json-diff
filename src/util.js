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
  assertComparable,
  parseJsonOrThrow,
  promisify
};
