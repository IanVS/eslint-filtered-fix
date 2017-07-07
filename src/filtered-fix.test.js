/* eslint-env jest */

const path = require('path');
const filteredFix = require('./filtered-fix');

describe('filtered-fix', () => {
  describe('makeFixer()', () => {
    it('returns a function', () => {
      const fixFunc = filteredFix.makeFixer({rules: ['semi']});
      expect(typeof fixFunc).toBe('function');
    });

    it('returns false if rules array is not provided', () => {
      const fixFunc = filteredFix.makeFixer();
      expect(fixFunc).toBe(false);
    });

    describe('the function returned', () => {
      const eslintMessage = {
        ruleId  : 'eqeqeq',
        severity: 2,
        message : 'Expected \'===\' and instead saw \'==\'.',
        line    : 1,
        column  : 8,
        nodeType: 'BinaryExpression',
        source  : 'if (foo == bar) {',
      };

      it('returns true if called with a message having a ruleId in the provided rules array', () => {
        const fixFunc = filteredFix.makeFixer({rules: ['eqeqeq']});
        expect(fixFunc(eslintMessage)).toBe(true);
      });

      it('returns false if called with a message having a ruleId not in the provided rules array', () => {
        const fixFunc = filteredFix.makeFixer({rules: ['semi']});
        expect(fixFunc(eslintMessage)).toBe(false);
      });
    });
  });

  describe('calculateFixes()', () => {
    it('does not calculate fixes to rules not specified', () => {
      const filepath = path.resolve(path.join(__dirname, '../fixtures/no-semi.js'));
      const fixFunc = filteredFix.makeFixer({rules: ['eqeqeq']});
      const eslintOptions = {fix: fixFunc};
      const eslintCli = filteredFix.getEslintCli(eslintOptions);
      const report = filteredFix.calculateFixes([filepath], eslintCli);
      expect(report.errorCount).toBe(1);
      expect(report.results[0].filePath).toBe(filepath);
      expect(report.results[0].output).toBeUndefined();
    });

    it('calculates fixes if rule is specified', () => {
      const filepath = path.resolve(path.join(__dirname, '../fixtures/no-semi.js'));
      const fixFunc = filteredFix.makeFixer({rules: ['semi']});
      const eslintOptions = {fix: fixFunc};
      const eslintCli = filteredFix.getEslintCli(eslintOptions);
      const report = filteredFix.calculateFixes([filepath], eslintCli);
      expect(report.errorCount).toBe(0);
      expect(report.results[0].output).toBe('var foo = 42;\n');
    });

    it('calculates fixes for multiple rules', () => {
      const filepath = path.resolve(path.join(__dirname, '../fixtures/no-semi-newline.js'));
      const fixFunc = filteredFix.makeFixer({rules: ['semi', 'newline-after-var']});
      const eslintOptions = {fix: fixFunc};
      const eslintCli = filteredFix.getEslintCli(eslintOptions);
      const report = filteredFix.calculateFixes([filepath], eslintCli);
      expect(report.errorCount).toBe(1);
      expect(report.results[0].output).toBe('var foo = 42;\n\nif (foo == 42) {\n    foo++;\n}\n');
    });
  });
});
