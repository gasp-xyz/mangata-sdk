module.exports = {
  plugins: ['prettier'],
  extends: ['standard', 'prettier'],
  parser: 'babel-eslint',
  rules: {
    'no-var': 'warn',
    'prefer-const': 'warn',
    'no-console': 'warn',
    'prettier/prettier': 'warn',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    semi: 0,
  },
}
