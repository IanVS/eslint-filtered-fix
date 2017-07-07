const options = require('./options');
const filteredFix = require('./filtered-fix');

const cli = {
  execute(args) {
    let currentOptions = {};
    let files = [];
    let extensions = [];
    let rules = [];

    // Parse options
    try {
      currentOptions = options.parse(args);
      files = currentOptions._;
      extensions = currentOptions.ext;
      rules = currentOptions.rule;
    } catch (error) {
      console.error(error.message);
      return 1;
    }

    // Decide what to do based on options
    if (currentOptions.version) {
      // Show version from package.json
      console.log('v' + currentOptions.version);
    } else if (currentOptions.help || (!files.length)) {
      // Show help
      console.log(options.generateHelp());
    } else {
      const fixOptions = {rules};
      const eslintOptions = {extensions};
      filteredFix.fix(files, fixOptions, eslintOptions);
    }
    return 0;
  },
};

module.exports = cli;
