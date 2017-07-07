# Warning

**This doesn't actually work yet**

It requires https://github.com/eslint/eslint/issues/8039 to be implemented first.  So far, this is just a proof-of-concept while I work on that issue.

# eslint-filtered-fix

[![npm][npm-badge]][npm-badge-url]
[![Build Status][travis-badge]][travis-badge-url]

This tool allows additional control over the fixes that ESLint makes to your code.
It uses the ESLint that you've installed in your project (`>=4.2.0`), and allows you to specify exactly which rules to fix.

ESLint can save a lot of drudgery by automatically fixing your code to meet the
guidelines that you've told it to enforce.
But, by using the built-in `eslint --fix` command, your code can undergo drastic changes,
especially if you have recently introduced ESLint or added more rules that are failing.
Sometimes, it's better to fix a single rule or a small set of rules at a time,
resulting in smaller, more focused commits.  That is exactly what you can do with eslint-filtered-fix.

## Installation

```shell
npm install --save-dev eslint-filtered-fix
```

or

```shell
yarn add --dev eslint-filtered-fix
```

Also ensure that you have a version of ESLint which is `4.2.0` or newer.

## Usage

Add as an npm script, or run it directly with yarn:

```shell
yarn eslint-filtered-fix <filename or dir>
```

If you do not add any other options, all fixes will be applied, as if you had run `eslint --fix` on the files you specified.

## Options

### --rule <rule-name>

Only apply fixes for the rule(s) specified.
You can specify multiple rules by adding more than one `--rule`, or using an array
`--rule [semi,newline-after-var]`. (Notice that spaces in the array are not allowed.)

### --no-warnings

If you do not want lint warnings to be autofixed, use the `--no-warnings` flag.
With that flag, only errors will be fixed.

### --no-warnings

If you do not want lint warnings to be autofixed, use the `--no-warnings` flag.
With that flag, only errors will be fixed.

### --ext

If your javascript files have an extension other than `.js`, you can use the `--ext` flag to
specify which extensions to examine.
For example, this will fix the `semi` rule in all files within the `lib` directory ending in `.jsx` or `.js`:

```shell
eslint-filtered-fix lib/ --ext .jsx,.js --rule semi
```

### globs

You are not limited to directory and file names as arguments, you can also specify a glob pattern.
For example, to examine all .jsx files in "test/" directories within "lib/":

```shell
eslint-filtered-fix lib/**/test/**/*.jsx --rule semi
```


## Notes

This module does not make any decisions about which ESLint rules to run.
Make sure your project has a valid ESLint config file.

[npm-badge]: https://img.shields.io/npm/v/eslint-filtered-fix.svg
[npm-badge-url]: https://www.npmjs.com/package/eslint-filtered-fix
[travis-badge]: https://travis-ci.org/IanVS/eslint-filtered-fix.svg?branch=master
[travis-badge-url]: https://travis-ci.org/IanVS/eslint-filtered-fix
