const ChangeTypes = {
  MUTATION: 'c',
  INSERTION: '+',
  DELETION: '-'
};

class Change {
  constructor(type, paths=[], from=undefined, to=undefined) {
    this.type = type;
    this.paths = paths.slice();
    this.to = type === ChangeTypes.INSERTION ? from : to;
    this.from = from;
  }
}

Change.ChangeTypes = ChangeTypes;

module.exports = Change;
