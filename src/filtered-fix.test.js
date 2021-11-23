/* eslint-env jest */
'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const shell = require('shelljs');
const filteredFix = require('./filtered-fix');

describe('filtered-fix', () => {
  describe('makeFixer()', () => {
    it('returns a function', () => {
      const fixFunc = filteredFix.makeFixer({ rules: ['semi'] });
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
        const fixFunc = filteredFix.makeFixer({ rules: ['eqeqeq'] });
        expect(fixFunc(eslintMessage)).toBe(true);
      });

      it('returns false if called with a message having a ruleId not in the provided rules array', () => {
        const fixFunc = filteredFix.makeFixer({ rules: ['semi'] });
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

    it('returns a report of linting errors', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = false;
      const [report] = await filteredFix.fix([filepath], fixOptions, {});
      expect(report.errorCount).toBe(1);
    });

    it('accepts a single file', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = false;
      const [report] = await filteredFix.fix(filepath, fixOptions, {});
      expect(report.errorCount).toBe(1);
    });

    it('fixes all rules if no options are specified', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const [report] = await filteredFix.fix(filepath);
      expect(report.errorCount).toBe(0);
      expect(shell.cat(filepath).toString()).toBe(`var foo = 42;${os.EOL}`);
    });

    it('fixes all rules if an empty options object specified', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const [report] = await filteredFix.fix(filepath, {});
      expect(report.errorCount).toBe(0);
      expect(shell.cat(filepath).toString()).toBe(`var foo = 42;${os.EOL}`);
    });

    it('applies fixes to files', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = true;
      const [report] = await filteredFix.fix(filepath, fixOptions, {});
      expect(report.errorCount).toBe(0);
    });

    it('returns a report of unfixed linting errors', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = true;
      const [report] = await filteredFix.fix(filepath, fixOptions, {});
      expect(report.errorCount).toBe(0);
    });

    it('does not require an explicit argument for eslint options', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = false;
      const [report] = await filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(1);
    });

    it('does not perform fixes to rules not specified', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = { rules: ['eqeqeq'] };
      const [report] = await filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(1);
      expect(report.filePath).toBe(filepath);
      expect(shell.cat(filepath).toString()).toBe(`var foo = 42${os.EOL}`);
    });

    it('performs fixes if rule is specified', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = { rules: ['semi'] };
      const [report] = await filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(0);
      expect(shell.cat(filepath).toString()).toBe(`var foo = 42;${os.EOL}`);
    });

    it('performs fixes for multiple rules', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './no-semi-newline.js'));
      const fixOptions = { rules: ['semi', 'newline-after-var'] };
      const [report] = await filteredFix.fix(filepath, fixOptions);
      expect(report.errorCount).toBe(1);
      expect(shell.cat(filepath).toString()).toBe(`var foo = 42;${os.EOL}\nif (foo == 42) {${os.EOL}    foo++;${os.EOL}}${os.EOL}`);
    });

    it('does not fix warnings if warnings option is false', async () => {
      const filepath = path.resolve(path.join(fixtureDir, './extra-parens.js'));
      const fixOptions = { warnings: false };
      const [report] = await filteredFix.fix(filepath, fixOptions);
      expect(report.warningCount).toBe(1);
      expect(shell.cat(filepath).toString()).toBe(`var a = (b * c);${os.EOL}`);
    });

    it('performs fixes for multiple files', async () => {
      const filepath1 = path.resolve(path.join(fixtureDir, './no-semi-newline.js'));
      const filepath2 = path.resolve(path.join(fixtureDir, './no-semi.js'));
      const fixOptions = { rules: ['semi', 'newline-after-var'] };
      const [report1, report2] = await filteredFix.fix([filepath1, filepath2], fixOptions);
      expect(report1.errorCount).toBe(1);
      expect(report2.errorCount).toBe(0);
      expect(shell.cat(filepath1).toString()).toBe(`var foo = 42;${os.EOL}\nif (foo == 42) {${os.EOL}    foo++;${os.EOL}}${os.EOL}`);
      expect(shell.cat(filepath2).toString()).toBe(`var foo = 42;${os.EOL}`);
    });

    it('performs fixes for directories', async () => {
      const dir = path.resolve(path.join(fixtureDir));
      const fixOptions = { rules: ['semi', 'newline-after-var'] };
      const reports = await filteredFix.fix(dir, fixOptions);
      expect(reports.length).toBe(4);
      const [extraParens] = reports;
      expect(extraParens.filePath.endsWith('extra-parens.js')).toBe(true);
      expect(extraParens.errorCount).toBe(0);
      expect(shell.cat(extraParens.filePath).toString()).toBe(`var a = (b * c);${os.EOL}`);
    });
  });
});
