const CLIEngine = require('eslint').CLIEngine;

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

    if (rulesToFix.includes(eslintMessage.ruleId)) {
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
  return new CLIEngine(options);
}

function calculateFixes(files, eslintCli) {
  return eslintCli.executeOnFiles(files);
}

function applyFixes(report) {
  CLIEngine.outputFixes(report);
}

function fix(files, fixOptions, eslintOptions) {
  // Ensure files are an array
  let fileList = [].concat(files);

  const fixFunc = makeFixer(fixOptions);
  const cliOptions = Object.assign({}, eslintOptions, {fix: fixFunc});
  const eslintCli = getEslintCli(cliOptions);
  const report = calculateFixes(fileList, eslintCli);
  applyFixes(report);

  // Re-run eslint to get new report
  return calculateFixes(fileList, eslintCli);
}


module.exports = {
  fix,
  makeFixer,
};
