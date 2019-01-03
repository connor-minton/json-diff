const {
  getSimpleType,
  assertComparable,
  parseJsonOrThrow
} = require('./util');

const Change = require('./change');
const { INSERTION, DELETION, MUTATION } = Change.ChangeTypes;

/**
 * `a` and `b` are JSON strings.
 */
function jsonDiff(a, b) {
  const objA = parseJsonOrThrow(a, 'a'),
        objB = parseJsonOrThrow(b, 'b');
  const changes = [];
  compare(objA, objB, changes, []);
  return changes;
}

/**
 * Recursively pushes diffs between `a` and `b` onto `changes`
 */
function compare(a, b, changes, pathStack) {
  let equal = true;

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

  if (aType !== bType) {
    changes.push(new Change(MUTATION, pathStack, a, b));
    equal = false;
  }
  else if (aType === 'object')
    equal = compareObjects(a, b, changes, pathStack) && equal;
  else if (aType === 'array')
    equal = compareArrays(a, b, changes, pathStack) && equal;
  else if (a !== b)
    changes.push(new Change(MUTATION, pathStack, a, b));

  return equal;
}

function compareObjects(a, b, changes, pathStack) {
  let equal = true;

  for (let [aKey, aVal] of Object.entries(a)) {
    pathStack.push(aKey);
    const bVal = b[aKey];
    if (getSimpleType(bVal) === 'undefined') {
      changes.push(new Change(DELETION, pathStack));
      equal = false;
    }
    else {
      equal = compare(aVal, bVal, changes, pathStack) && equal;
    }
    pathStack.pop(aKey);
  }

  for (let [bKey, bVal] of Object.entries(b)) {
    pathStack.push(bKey);
    const aVal = a[bKey];
    if (getSimpleType(aVal) === 'undefined') {
      changes.push(new Change(INSERTION, pathStack, bVal));
      equal = false;
    }
    pathStack.pop(bKey);
  }

  return equal;
}

function compareArrays(a, b, changes, pathStack) {
  let equal = true;

  if (a.length !== b.length) {
    changes.push(new Change(MUTATION, pathStack, a, b));
    equal = false;
  }
  else {
    for (let i = 0; i < a.length && equal; i++) {
      equal = compare(a[i], b[i], changes, pathStack) && equal;
    }
  }

  return equal;
}

module.exports = jsonDiff;
