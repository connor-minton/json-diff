#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('./util');
const { SimpleFormatter } = require('./formatters');
const jsonDiff = require('./json-diff');
const readFile = promisify(fs.readFile);

const USAGE = 'usage: json-diff file1.json file2.json';

const { fileA, fileB, useColor } = parseArgs(process.argv);
const formatter = new SimpleFormatter({ useColor });

Promise.all([readFile(fileA), readFile(fileB)])
  .then(([jsonA, jsonB]) => {
    console.log(formatter.format(jsonDiff(jsonA, jsonB)));
  })
  .catch(err => {
    exitError(err);
  });

// -----------------------------------------------------------------------------

function exitError(error) {
  console.error(`json-diff: error: ${error}`);
  process.exit(1);
}

function exitUsage() {
  console.error(USAGE);
  process.exit(1);
}

function parseArgs(args) {
  args = args.slice(2);
  if (args.length !== 2)
    exitUsage();

  return {
    fileA: args[0],
    fileB: args[1],
    useColor: true // TODO: get this from flag
  };
}
