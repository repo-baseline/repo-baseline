const Promise = require('bluebird');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

class RuleManager {
    constructor(options) {
        this.options = options;
        this.source = null;
    }

    _getPath(repoPath) {
        return path.join(
            repoPath,
            'repo-baseline.yml'
        );
    }

    async _getLocalFile(rulesFilePath) {
            const rawFileContent = fs.readFileSync(rulesFilePath, 'utf8');
            return Promise.resolve(rawFileContent);
    }

    _getDefaultRules() {
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

    async _getRemoteFile(url) {
        return new Promise((resolve, reject) => {
            let request = http;
            let data = '';
    
            if (this._isHttpsUrl(url)) {
                request = https;
            }
            return request.get(url, (resp) => {
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                });
            });
        })
    }

    _parseYamlString(yamlString) {
        return yaml.safeLoad(yamlString)
    }

    _isHttpsUrl(url) {
        return /^https/.test(url);
    }

    async getRules() {
        try {
            let rawFileContent;
            if (this.options.url) {
                rawFileContent = await this._getRemoteFile(this.options.url);
                this.source = this.options.url;
            } else if (this.options.path) {
                const rulesFilePath = this._getPath(this.options.path);
                rawFileContent = await this._getLocalFile(rulesFilePath);
                this.source = rulesFilePath;
            }
            return this._parseYamlString(rawFileContent)['repo-baseline'];
        } catch (err) {
            this.source = 'default rules';
            return this._getDefaultRules()
        }   
    }

    get rulesSource() {
        return this.source;
    }
}

module.exports = RuleManager;