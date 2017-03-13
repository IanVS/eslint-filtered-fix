const options = require('./options');
const fixer = require('./fixer');

const cli = {
    execute(args) {
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
            console.log('v' + version);
        }

        else if (currentOptions.help || (!files.length)) {
            // Show help
            console.log(options.generateHelp());
        }

        else if (!rules || !rules.length){
            console.log('You must specify at least one rule to use.')
        }

        else {
            const fixFunc = fixer.makeFixer({rules});
            const eslintOptions = {
                extensions,
                fix: fixFunc,
            }
            const eslintCli = fixer.getEslintCli(eslintOptions);
            const report = fixer.calculateFixes(files, eslintCli);
            fixer.applyFixes(report);
        }
    }
}

module.exports = cli;
