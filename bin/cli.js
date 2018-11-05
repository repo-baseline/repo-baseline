#!/usr/bin/env node

const Promise = require('bluebird');
const program = require('commander');
const fs = require('fs');
const npm = require("npm");
const path = require('path');
const { version } = require('../package.json')
const yaml = require('js-yaml')
const exec = require('child_process').exec
    
program
  .version(version)
  .option('-p, --path [path]', 'Add path')
  .parse(process.argv);



let rules = loadRulesFromSelectedRepo(program.path);

function loadRulesFromSelectedRepo(repoPath) {
    return loadRepoBaselineYml(
        getPathOfRules(program.path)
    );
}

function loadRepoBaselineYml(path) {
    return yaml.safeLoad(fs.readFileSync(path, 'utf8'))['repo-baseline']
}

function getPathOfRules(repoPath) {
    return path.join(
        repoPath,
        'repo-baseline.yml'
    )
}

function getListOfPackages(baselineYmlData) {
    return baselineYmlData.map((rule) => {
        return rule.name;
    })
}

function diff(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x))
}

function getListOfPackagesToInstall(fullPackagesList) {
    return new Promise((resolve, reject) => {
        exec('npm ls --json', function(err, stdout, stderr) {
            if (err) return reject(err)
            const installedPackages = Object.keys(JSON.parse(stdout).dependencies).filter(element => {
                return element.substr(0,13) === 'repo-baseline'
            });
            const diff1 = diff(fullPackagesList, installedPackages)
            resolve(diff1)
          });
    })
    
}

function installMissingPackages(missingPackages) {
    return Promise.resolve(missingPackages)
        .each((packageName) => {
            return installPackage(packageName)
                .then((package) => {
                    console.log(`"${packageName}" installed`)
                    // allPackageNames.push(packageName)
                })
        })
}

const packages = getListOfPackages(rules);

function getRulesOfPackage(packageName) {
    const package = require(packageName);
    let rules = []
    if (package.getRules) {
        rules = package.getRules();
    }
    return rules;
}


// let allPackageNames = packages;
let allPackageRules = [];
getListOfPackagesToInstall(packages)
    .then((missingPackages) => {
        return installMissingPackages(missingPackages)
    })
    .then(() => {
        const rules = loadRulesFromSelectedRepo(program.path);
        return getListOfPackages(rules);
    })
    .each((packageName) => {
        console.log(packageName, getRulesOfPackage(packageName))
        allPackageRules = allPackageRules.concat(getRulesOfPackage(packageName))
    })
    .then(() => {
        allPackageRules = allPackageRules.concat(rules)
    })
    .then(() => {
        console.log('#############')
        console.log(JSON.stringify(allPackageRules, null, 2));
        return allPackageRules;
    })
    .each((ruleSet) => {
        const package = require(ruleSet.name);
        console.log(ruleSet.name, package)
        return package.run(program.path, ruleSet.options, (message) => {
            console.log(message)
        })
    })

function installPackage(packageName) {
    return new Promise((resolve, reject) => {
        npm.load({
            loaded: false
        }, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
    .then(() => {
        return new Promise((resolve, reject) => {
            npm.commands.install([packageName], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    const loadedPackage = require(packageName);
                    let packageRules = [];
                    if (loadedPackage.getRules) {
                        packageRules = loadedPackage.getRules()
                    }
                    resolve(packageRules)
                }
            });
        });
    })
}

/*

  //return installRules(program.path)
  //    .then(() => {
          return Promise.resolve(getFullListOfRules(program.path))
  //    })
      .each((packageName) => {
        const { run } = require(packageName.name);
        console.log(require(packageName.name))
          return run(program.path)
              .then(() => {
                  console.log(packageName.name, 'ok')
              })
              .catch(() => {
                  console.log(packageName.name, 'nok')
              })
      });
  
  console.log(isPackageInstalled(program.path, 'repo-baseline-contrib-package-json-available'))
  
  function getFullListOfRules(repoPath) {
      const pathOfPackageJson = getPathOfPackageJson(program.path);
      const packageJson = require(pathOfPackageJson)
      return packageJson['repo-baseline'];
  }
  
  function isPackageInstalled(repoPath, packageName) {
      const pathToPackage = path.join(
          repoPath,
          'node_modules',
          packageName
      )
      try {
          return fs.statSync(pathToPackage).isDirectory();
      } catch (err) {
          return false;
      }
  }
  
  function installRules(repoPath) {
      return new Promise((resolve, reject) => {
          const packagesToInstall = [];
          getFullListOfRules(repoPath).forEach(packageName => {
              if(!isPackageInstalled(repoPath, packageName)) {
                  packagesToInstall.push(packageName);
              }
          });
          return resolve(packagesToInstall)
      })
      .then((packagesToInstall) => {
          return new Promise((resolve, reject) => {
              npm.load({
                  loaded: false
              }, (err) => {
                  if (err) {
                      reject(err)
                  } else {
                      resolve(packagesToInstall)
                  }
              })
          })
      })
      .then((packagesToInstall) => {
          return new Promise((resolve, reject) => {
              if (!packagesToInstall) {
                  resolve()
                  return;
              }
              npm.commands.install(packagesToInstall, function (err, data) {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(data)
                  }
              });
          });
      });
  }
  */