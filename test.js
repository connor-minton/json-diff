const jdiff = require('.');
const a = require('./test/data/data007');
const b = require('./test/data/data008');
// const a = require('./package');
// const b = require('../url-encode/package');

console.log(jdiff(a, b).join('\n'));
