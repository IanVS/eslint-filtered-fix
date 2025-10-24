import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
	{ files: ["**/*.js"], languageOptions: { globals: globals.node } },
	{ files: ["**/*.test.js"], languageOptions: { globals: globals.jest } },
  // Used for tests
  {
    files: ["tmp/**/*.js"],
    "rules": {
      "eqeqeq": "error",
      "semi": ["error", "always"],
      "newline-after-var": "error",
      "no-extra-parens": "warn"
    }
  },
	{
    files: ["**/*.js"],
    ignores: ["tmp/**/*"],
    plugins: { js },
    extends: ["js/recommended"],
    "rules": {
      "consistent-return"                : [2],
      "no-use-before-define"             : [2],
      "brace-style"                      : [2, "1tbs"],
      "eqeqeq"                           : [2, "smart"],
      "indent"                           : [2, 2, { "VariableDeclarator": 2 }],
      "key-spacing"                      : [2, {"align": "colon"}],
      "no-multi-spaces"                  : [2, {"exceptions": {"VariableDeclarator": true}}],
      "no-multiple-empty-lines"          : [2, {"max": 2}],
      "space-before-function-paren"      : [2, {"anonymous" : "always", "named" : "never"}],
      "spaced-comment"                   : [2, "always", { "exceptions": ["-"]}],
      "wrap-iife"                        : [2, "inside"],
      "semi"                             : [2, "always"],
      "no-extra-semi"                    : [2],
      "semi-spacing"                     : [2, { "before": false, "after": true }],
      "comma-dangle"                     : [2, "always-multiline"]
    },
  },
]);
