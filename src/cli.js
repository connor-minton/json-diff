#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('./util');
const jsonDiff = require('./json-diff');
const readFile = promisify(fs.readFile);
const config = require('./config');
const cli = require('yargs');

cli
  .scriptName('json-diff')
  .command('$0 <file1> <file2>',
    'Compare JSON files or the Node.js style exports of JS files.',
    command => {
      command
        .usage('Usage:\n  $0 [options] file1 file2')
        .alias('h', 'help')
        .alias('v', 'version')
        .option('color', {
          type: 'boolean',
          describe: 'Colorized output is on by default. To turn off, pass `--no-color`.',
          default: true
        })
        // .option('d', {
        //   alias: 'deleted',
        //   type: 'boolean',
        //   describe: 'Show only deletions. Can be combined with -i and -c.',
        //   default: true
        // })
        // .option('i', {
        //   alias: 'inserted',
        //   type: 'boolean',
        //   describe: 'Show only insertions. Can be combined with -d and -c.',
        //   default: true
        // })
        // .option('c', {
        //   alias: 'changed',
        //   type: 'boolean',
        //   describe: 'Show only changes (mutations). Can be combined with -d and -i.',
        //   default: true
        // })
        // .option('D', {
        //   alias: 'depth',
        //   type: 'number',
        //   describe: 'Abbreviate diffs (e.g., object[8] -> object[4]) when the path is at the specified depth. The depth of `.` is 0.'
        // })
        // .option('path1', {
        //   type: 'string',
        //   describe: 'Specify a dot-delimited object path in file1 as the JSON to diff against file2'
        // })
        // .option('path2', {
        //   type: 'string',
        //   describe: 'Specify a dot-delimited object path in file2 as the JSON to diff against file1'
        // })
    },
    runJsonDiff);

cli.parse();

// -----------------------------------------------------------------------------

function runJsonDiff(argv) {
  config.useArgv(argv);
  const { file1, file2, useColor } = config.values;

  const Formatter = config.get('Formatter');
  const formatter = new Formatter({ useColor });

  Promise.all([readFile(file1), readFile(file2)])
    .then(([json1, json2]) => {
      const diff = jsonDiff(json1, json2);
      if (diff.length > 0)
        console.log(formatter.format(diff));
    })
    .catch(err => {
      exitError(err);
    });
}

// -----------------------------------------------------------------------------

function exitError(error) {
  console.error(`json-diff: error: ${error}`);
  process.exit(1);
}
