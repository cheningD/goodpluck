module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: ["dist", "tests/e2e/*", "vitest.config.ts"],
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off", // disabled to run tests
    "prettier/prettier": "error",
  },
  plugins: ["prettier"],
};
