const jdiff = require('.');
const a = require('./test/data/data003');
const b = require('./test/data/data004');

console.log(jdiff(a, b).join('\n'));
