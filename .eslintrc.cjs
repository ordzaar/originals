const path = require("path");

module.exports = {
  extends: ["./node_modules/@ordzaar/standard-linter"],
  parserOptions: { project: [path.join(__dirname, "tsconfig.eslint.json")] },
  overrides: [
    {
      files: ["**/.eslintrc.cjs", "jest.sequencer.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["*.{ts,js}"],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "no-void": "off",
        "unused-imports/no-unused-vars": "warn",
        "no-underscore-dangle": "off",
      },
    },
  ],
};
