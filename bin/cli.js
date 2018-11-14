#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json')
const { PluginManager } = require("live-plugin-manager");
const RuleManager = require('../src/RuleManager');
const RuleSet = require('repo-baseline-ruleset');

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

    try {
        await RuleSet(manager, program.path, rules)
            .run((message, isValid) => {
                if (isValid) {
                    printValidMessage(message);
                } else {
                    printInvalidMessage(message);
                }
            })
    } finally {
        console.log(`\ntotal: ${counter.valid + counter.invalid}, valid: ${counter.valid}, invalid: ${counter.invalid}`)
    }
})();

