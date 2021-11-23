'use strict';

const { ESLint } = require('eslint');

/**
 * Creates a fixing function or boolean that can be provided as eslint's `fix`
 * option.
 *
 * @param  {Object|boolean} options Either an options object, or a boolean
 * @return {Function|boolean}       `fix` option for eslint
 */
function makeFixer(options) {
  if (typeof options === 'undefined') {
    return true;
  }

  if (typeof options === 'boolean') {
    return options;
  }

  const rulesToFix = options.rules;
  const fixWarnings = options.warnings;

  function ruleFixer(eslintMessage) {
    if (!rulesToFix) return true;

    if (rulesToFix.indexOf(eslintMessage.ruleId) !== -1) {
      return true;
    }
    return false;
  }

  function warningFixer(eslintMessage) {
    if (fixWarnings === false) {
      return eslintMessage.severity === 2;
    }

    return true;
  }

  return function (eslintMessage) {
    return ruleFixer(eslintMessage) && warningFixer(eslintMessage);
  };
}

function getEslintCli(options) {
  return new ESLint(options);
}

async function calculateFixes(files, eslintCli) {
  return eslintCli.lintFiles(files);
}

async function applyFixes(report) {
  await ESLint.outputFixes(report);
}

async function fix(files, fixOptions, eslintOptions) {
  // Ensure files are an array
  const fileList = [].concat(files);

  const fixFunc = makeFixer(fixOptions);
  const cliOptions = Object.assign({}, eslintOptions, { fix: fixFunc });
  const eslintCli = getEslintCli(cliOptions);
  const report = await calculateFixes(fileList, eslintCli);
  await applyFixes(report);

  // Re-run eslint to get new report
  return calculateFixes(fileList, eslintCli);
}


module.exports = {
  fix,
  makeFixer,
};
