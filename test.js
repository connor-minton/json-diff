const jdiff = require('.');
// const a = require('./test/data/data003');
// const b = require('./test/data/data004');
const a = require('./package');
const b = require('../url-encode/package');

console.log(jdiff(a, b).join('\n'));
