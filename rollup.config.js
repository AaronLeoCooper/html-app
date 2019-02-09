import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

import { name as projectName } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

console.log('isProduction', isProduction);

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: `dist/${projectName}.browser.js`,
      format: 'umd',
      name: 'HTMLApp'
    },
    {
      file: `dist/${projectName}.es.js`,
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    !isProduction && serve({
      open: true,
      openPage: '/example.html',
      contentBase: ['src', 'dist'],
      port: 3000
    })
  ].filter(Boolean)
};
