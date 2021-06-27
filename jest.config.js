module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js?$': require.resolve('babel-jest'),
    '^.+\\.mjs?$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: ['node_modules/(?!(@polkadot/api))/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
  testTimeout: 3600000,
}
