module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-var": "warn",
    "prefer-const": "warn",
    "no-console": "warn",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    semi: 0
  }
};
