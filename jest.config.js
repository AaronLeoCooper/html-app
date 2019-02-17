module.exports = {
  setupFilesAfterEnv: ['./test/setupTests.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
    '/test/'
  ],
  collectCoverageFrom: ['src/**/*.js']
};
