#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json')
const rulesFile = require('../src/rulesFile');
const { PluginManager } = require("live-plugin-manager");
const RuleSet = require('repo-baseline-ruleset'); 

program
  .version(packageJson.version)
  .option('-p, --path [path]', 'Add path', process.cwd())
  .parse(process.argv);

console.log(`checking directory: ${program.path}\n`)
let rules = rulesFile.get(program.path);
const repoPath = program.path || process.cwd();
const manager = new PluginManager();

const counter = {
    valid: 0,
    invalid: 0
};

function printValidMessage(message) {
    printMessage(message, true);
    counter.valid++;
}

function printInvalidMessage(message) {
    printMessage(message, false);
    counter.invalid++;
}

function printMessage(message, isValid) {
    console.log('    ', message, isValid);
}

return RuleSet(manager, repoPath, rules)
    .run((message, isValid) => {
        if (isValid) {
            printValidMessage(message);
        } else {
            printInvalidMessage(message);
        }
    })
    .then(() => {
        console.log(`\ntotal: ${counter.valid + counter.invalid}, valid: ${counter.valid}, invalid: ${counter.invalid}`)
        process.exit(0)
    })
    .catch(() => {
        console.log(`\ntotal: ${counter.valid + counter.invalid}, valid: ${counter.valid}, invalid: ${counter.invalid}`)
        process.exit(1)
    })