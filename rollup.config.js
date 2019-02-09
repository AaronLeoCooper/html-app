import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import { uglify } from 'rollup-plugin-uglify';

import { name as projectName } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

console.log('isProduction', isProduction);

const input = 'src/index.js';

const commonPlugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**'
  })
];

module.exports = [
  {
    input,
    output: [
      {
        file: `dist/${projectName}.browser.js`,
        format: 'iife',
        name: 'HTMLApp'
      },
      {
        file: `dist/${projectName}.es.js`,
        format: 'es'
      }
    ],
    plugins: [
      ...commonPlugins,
      !isProduction && serve({
        open: true,
        openPage: '/simple/index.html',
        contentBase: ['dist', 'examples'],
        port: 3000
      })
    ]
  },
  isProduction && {
    input,
    output: [
      {
        file: `dist/${projectName}.browser.min.js`,
        format: 'iife',
        name: 'HTMLApp'
      }
    ],
    plugins: [
      ...commonPlugins,
      uglify()
    ]
  }
].filter(Boolean);
