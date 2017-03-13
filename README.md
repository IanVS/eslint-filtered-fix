# eslint-fix

[![npm][npm-badge]][npm-badge-url]
[![dependency status][versioneye-badge]][versioneye-badge-url]
[![Build Status][travis-badge]][travis-badge-url]

This tool allows additional control over the fixes that ESLint makes to your code.
It uses the ESLint that you've installed in your project, and allows you to specify exactly which rules to fix.

ESLint can save a lot of drudgery by automatically fixing your code to meet the
guidelines that you've told it to enforce.
But, by using the built-in `eslint --fix` command, your code can undergo drastic changes,
especially if you have recently introduced ESLint or added more rules that are failing.
Sometimes, it's better to fix a single rule or a small set of rules at a time,
resulting in smaller, more focused commits.  That is exactly what you can do with eslint-fix.

## Installation

```shell
npm install --save-dev eslint-fix
```

or

```shell
yarn add --dev eslint-fix
```

Also ensure that you have a version of ESLint which is `3.17.0` or newer.

## Usage

Add as an npm script, or run it directly with yarn:

```shell
yarn eslint-fix <filename or dir> --rule <rule-name>
```

You must specify both a target (filename or directory), _and_ at least one rule to fix.
You can specify multiple rules by adding more than one `--rule`, or using an array
`--rule [semi,newline-after-var]`. (Notice that spaces in the array are not allowed.)

## Options

### --ext

If your javascript files have an extension other than `.js`, you can use the `--ext` flag to
specify which extensions to examine.
For example, this will fix the `semi` rule in all files within the `lib` directory ending in `.jsx` or `.js`:

```shell
eslint-fix lib/ --ext .jsx,.js --rule semi
```

### globs

You are not limited to directory and file names as arguments, you can also specify a glob pattern.
For example, to examine all .jsx files in "test/" directories within "lib/":

```shell
eslint-fix lib/**/test/**/*.jsx --rule semi
```


## Notes

This module does not make any decisions about which ESLint rules to run.
Make sure your project has a valid ESLint config file.

[npm-badge]: https://img.shields.io/npm/v/eslint-fix.svg
[npm-badge-url]: https://www.npmjs.com/package/eslint-fix
[versioneye-badge]: https://www.versioneye.com/user/projects/558f4ff7316338001e000259/badge.svg?style=flat
[versioneye-badge-url]: https://www.versioneye.com/user/projects/558f4ff7316338001e000259#dialog_dependency_badge
[travis-badge]: https://travis-ci.org/IanVS/eslint-fix.svg?branch=master
[travis-badge-url]: https://travis-ci.org/IanVS/eslint-fix
