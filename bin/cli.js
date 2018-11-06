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

console.log("checking directory:", program.path)
let rules = rulesFile.get(program.path);
const repoPath = program.path || process.cwd();
const manager = new PluginManager();

return RuleSet(manager, repoPath, rules).run((message, isValid) => {
    console.log("    ", message, isValid)
})