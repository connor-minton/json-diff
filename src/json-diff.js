const {
  getSimpleType,
  assertComparable,
  getValueChangedString,
  getKeyAddedString,
  getKeyRemovedString,
  parseJsonOrThrow
} = require('./util');

/**
 * If `a` or `b` is a string, then it will be assumed to be a JSON string
 * and parsed.
 */
function jsonDiff(a, b) {
  const changes = [];
  compare(a, b, changes, []);
  return changes;
}

/**
 * Recursively pushes diffs between `a` and `b` onto `changes`
 */
function compare(a, b, changes, pathStack) {
  const aType = getSimpleType(a), bType = getSimpleType(b);
  assertComparable(aType, bType);

  if (aType === 'number')
    a = +a;
  else if (aType === 'string')
    a = String(a);

  if (bType === 'number')
    b = +b;
  else if (bType === 'string')
    b = String(b);

  if (aType !== bType)
    changes.push(getValueChangedString(pathStack, a, b));
  else if (aType === 'object')
    compareObjects(a, b, changes, pathStack);
  else if (a !== b)
    changes.push(getValueChangedString(pathStack, a, b));
}

function compareObjects(a, b, changes, pathStack) {
  for (let [aKey, aVal] of Object.entries(a)) {
    pathStack.push(aKey);
    const bVal = b[aKey];
    if (getSimpleType(bVal) === 'undefined')
      changes.push(getKeyRemovedString(pathStack, aVal));
    else
      compare(aVal, bVal, changes, pathStack);
    pathStack.pop(aKey);
  }

  for (let [bKey, bVal] of Object.entries(b)) {
    pathStack.push(bKey);
    const aVal = a[bKey];
    if (getSimpleType(aVal) === 'undefined')
      changes.push(getKeyAddedString(pathStack, bVal));
    pathStack.pop(bKey);
  }
}

module.exports = jsonDiff;
