const RuleManager = require('../../../src/RuleManager');
const path = require('path')
const { expect } = require('chai');

describe(__filename, () => {
    describe('ruleSource property', () => {
        const logger = {
            log: () => {}
        }
        it('is null, if rules never asked for', () => {
            const manager = new RuleManager({ logger })
            expect(manager.rulesSource).equals(null);
        })
        it('is path of repo-baseline.yml of local file, if exists', async () => {
            const expectedBasePath = path.join(
                process.cwd(),
                'test/assets/repo-with-repo-baseline-yml'
            )
            const manager = new RuleManager({
                path: expectedBasePath,
                logger
            });
            await manager.getRules()
            expect(manager.rulesSource).equals(
                path.join(
                    expectedBasePath, 
                    'repo-baseline.yml'
                )
            );
        })
        it('is given url, if exists', async () => {
            const expectedSource = 'https://raw.githubusercontent.com/oliverlorenz/repo-baseline/master/repo-baseline.yml'
            const manager = new RuleManager({
                url: expectedSource,
                logger
            });
            await manager.getRules()
            expect(manager.rulesSource).equals(expectedSource);
        })
        it('gives "default rules" if selected file is not available', async () => {
            const expectedBasePath = path.join(
                process.cwd(),
                'test/assets/repo-does-not-exists'
            )
            const manager = new RuleManager({
                path: expectedBasePath,
                logger
            });
            await manager.getRules()
            expect(manager.rulesSource).equals('default rules');
        })
    })
})