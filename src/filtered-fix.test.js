/* eslint-env jest */

const path = require('path');
const os = require('os');
const fs = require('fs');
const shell = require('shelljs');
const filteredFix = require('./filtered-fix');

describe('filtered-fix', () => {
  describe('makeFixer()', () => {
    it('returns a function', () => {
      const fixFunc = filteredFix.makeFixer({rules: ['semi']});
      expect(typeof fixFunc).toBe('function');
    });

    it('returns true if rules array is not provided', () => {
      const fixFunc = filteredFix.makeFixer();
      expect(fixFunc).toBe(true);
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

  describe('fix()', () => {
    let fixtureDir;

    beforeEach(() => {
      fixtureDir = path.join(os.tmpdir(), '/eslint-filtered-fix/fixtures');
      shell.mkdir('-p', fixtureDir);
      shell.cp('-r', path.join(__dirname, '../fixtures/*'), fixtureDir);
      shell.cp('-r', path.join(__dirname, '../fixtures/.*'), fixtureDir);
      fixtureDir = fs.realpathSync(fixtureDir);
    });

    afterEach(() => {
      shell.rm('-r', fixtureDir);
    });

    it('returns a report of linting errors', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = false;
      const report = filteredFix.fix([filepath], fixOptions, {});
      expect(report.errorCount).toBe(1);
    });

    it('accepts a single file', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = false;
      const report = filteredFix.fix(filepath, fixOptions, {});
      expect(report.errorCount).toBe(1);
    });

    it('fixes all rules if no options are specified', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const report = filteredFix.fix(filepath);
      expect(report.errorCount).toBe(0);
      expect(shell.cat(filepath).stdout).toBe('var foo = 42;\n');
    });

    it('fixes all rules if an empty options object specified', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const report = filteredFix.fix(filepath, {});
      expect(report.errorCount).toBe(0);
      expect(shell.cat(filepath).stdout).toBe('var foo = 42;\n');
    });

    it('applies fixes to files', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = true;
      const report = filteredFix.fix(filepath, fixOptions, {});
      expect(report.errorCount).toBe(0);
    });

    it('returns a report of unfixed linting errors', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = true;
      const report = filteredFix.fix(filepath, fixOptions, {});
      expect(report.errorCount).toBe(0);
    });

    it('does not require an explicit argument for eslint options', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = false;
      const report = filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(1);
    });

    it('does not perform fixes to rules not specified', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = {rules: ['eqeqeq']};
      const report = filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(1);
      expect(report.results[0].filePath).toBe(filepath);
      expect(shell.cat(filepath).stdout).toBe('var foo = 42\n');
    });

    it('performs fixes if rule is specified', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = {rules: ['semi']};
      const report = filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(0);
      expect(shell.cat(filepath).stdout).toBe('var foo = 42;\n');
    });

    it('performs fixes for multiple rules', () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi-newline.js'));
      const fixOptions = {rules: ['semi', 'newline-after-var']};
      const report = filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(1);
      expect(shell.cat(filepath).stdout).toBe('var foo = 42;\n\nif (foo == 42) {\n    foo++;\n}\n');
    });
  });
});
