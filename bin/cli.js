#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json')
const { PluginManager } = require("live-plugin-manager");
const RuleManager = require('../src/RuleManager');
const RuleSet = require('repo-baseline-ruleset');
const chalk = require('chalk');

(async () => {
    program
        .version(packageJson.version)
        .option('-p, --path [path]', 'Add path', process.cwd())
        .option('-r, --remote [remotePath]', 'use external repo-baseline.yml')
        .parse(process.argv);

    const manager = new PluginManager();
    const rulesManager = new RuleManager({
        path: program.path,
        uri: program.remote
    })
    const rules = await rulesManager.getRules();
    console.log('source:', rulesManager.rulesSource)

    const counter = {
        valid: 0,
        invalid: 0
    };

    function printValidMessage(message, level) {
        printMessage(chalk.green("✔ ") + chalk.grey(message), level);
        counter.valid++;
    }
    
    function printInvalidMessage(message, level) {
        printMessage(chalk.red("✖ ") + chalk.grey(message), level);
        counter.invalid++;
    }
    
    function printMessage(message, level = 10) {
        console.log('  '.repeat(level), message);
    }

    try {
        await RuleSet(manager, program.path, rules)
            .run((message, isValid, level) => {
                if (isValid) {
                    printValidMessage(message, level);
                } else {
                    printInvalidMessage(message, level);
                }
            })
    } finally {
        console.log(`
Result:
${chalk.green("✔")} valid:   ${counter.valid}
${chalk.red("✖")} invalid: ${counter.invalid}
  total:   ${counter.valid + counter.invalid}
`);
    }
    const exitCode = (counter.invalid) === 0 ? 0 : 1;
    process.exit(exitCode);
})();
