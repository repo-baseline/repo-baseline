const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

function getPath(repoPath) {
    return path.join(
        repoPath,
        'repo-baseline.yml'
    );
}

function get(repoPath) {
    try {
        const rulesFilePath = getPath(repoPath);
        const rawFileContent = fs.readFileSync(rulesFilePath, 'utf8');
        const parsedFileContent = yaml.safeLoad(rawFileContent);
        return parsedFileContent['repo-baseline'];
    } catch (err) {
        return [
            { 
                name: 'repo-baseline-file-available', 
                options: { 
                    files: [ 
                        'repo-baseline.yml' 
                    ] 
                } 
            }
        ]
    }
}

function getRulePackagesRequired(repoPath) {
    return get(repoPath).map((rule) => {
        return rule.name
    })
}

module.exports = {
    get,
    getPath,
    getRulePackagesRequired,
}
