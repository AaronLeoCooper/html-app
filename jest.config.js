module.exports = {
  setupFilesAfterEnv: ['./test/setupTests.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
    '/test/'
  ],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'reports/junit', outputName: 'js-test-results.xml' }
    ]
  ]
};
