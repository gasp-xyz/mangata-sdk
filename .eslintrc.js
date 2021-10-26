module.exports = {
  plugins: ['prettier', '@typescript-eslint'],
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
  },
  rules: {
    'no-var': 'warn',
    'prefer-const': 'warn',
    'no-console': 'off',
    'prettier/prettier': 'warn',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    semi: 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
}
