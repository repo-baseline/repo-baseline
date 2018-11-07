[![Passing Tests on master](https://travis-ci.org/oliverlorenz/repo-baseline.svg?branch=master)](https://travis-ci.org/oliverlorenz/repo-baseline)
[![Dependency check](https://david-dm.org/oliverlorenz/repo-baseline/status.svg)](https://david-dm.org/oliverlorenz/repo-baseline)
[![Maintainability](https://api.codeclimate.com/v1/badges/efffccdc0db9b67c4f74/maintainability)](https://codeclimate.com/github/oliverlorenz/repo-baseline/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/efffccdc0db9b67c4f74/test_coverage)](https://codeclimate.com/github/oliverlorenz/repo-baseline/test_coverage) 
[![Greenkeeper badge](https://badges.greenkeeper.io/oliverlorenz/repo-baseline.svg)](https://greenkeeper.io/)

# repo-baseline

repo-baseline is a tool for your test pipeline. It helps you and your team not to fall below a certain quality level in your repository. You simply create a ruleset (or use a existing one) according to your taste, and repo-baseline checks if all requirements are met.

## Motivation

Any person today can put software online. The quality of the software is insignificant and often not very satisfactory. Deep dependency-trees and badly maintained repositories thus migrate into your own tech stack. This tool is supposed to add a building block to increase and maintain the quality of software.

## Usage

Try this: 
```
cd path/to/repository
npm repo-baseline
```

The tool will complain about not finding a `repo-baseline.yml`. As an example, you can take the `repo-baseline.yml` of this project by simply executing the following command:

```
curl -O https://raw.githubusercontent.com/oliverlorenz/repo-baseline/master/repo-baseline.yml
```
After that, do the following again:
```
npx repo-baseline
```