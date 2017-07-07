const CLIEngine = require('eslint').CLIEngine;

function makeFixer(options) {
  if (!options || !Array.isArray(options.rules) || !options.rules.length) {
    return false;
  }
  const rulesToFix = options.rules;

  return function (eslintMessage) {
    if (rulesToFix.includes(eslintMessage.ruleId)) {
      return true;
    }
    return false;
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



module.exports = {
  makeFixer,
  getEslintCli,
  calculateFixes,
  applyFixes,
};
