const isProduction = process.env.NODE_ENV === 'production';

console.log('isProduction', isProduction);

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/simple-renderer.browser.js',
      format: 'umd'
    }
  ]
};
