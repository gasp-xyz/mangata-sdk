const { resolve } = require('path')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js?$': require.resolve('babel-jest'),
    '^.+\\.mjs?$': require.resolve('babel-jest'),
  },
  moduleNameMapper: {
    '^utils/(.*)$': resolve(__dirname, 'src/utils/'),
    '^types/(.*)$': resolve(__dirname, 'src/types/'),
    '^services/(.*)$': resolve(__dirname, 'src/services/'),
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
