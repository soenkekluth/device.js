import fs from 'fs';

import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import memory from 'rollup-plugin-memory';

let pkg = JSON.parse(fs.readFileSync('./package.json'));
let external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}));

let format = process.env.FORMAT || 'umd';
let dest = pkg.main;

switch(format) {
  case 'es':
    dest = pkg.module;
  break;

  case 'iife':
    dest = pkg.browser;
  break;

  case 'umd':
    dest = pkg.main;
  break;

  default:
    break;
}

export default {
  entry: 'src/device.js',
  sourceMap: false,
  dest,
  format,
  external,
  moduleName: 'device',
  // exports: format==='es' ? null : 'default',
  plugins: [
    // format==='umd' && memory({
    //   path: 'src/device.js',
    //   contents: "export { default } from './device';"
    // }),
    resolve({
      jsnext: true,
      main: true,
      // browser: true,
      skip: format === 'iife' ? null : external
    }),
    eslint({
      include: [
        'src/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (format === 'iife' && uglify()),
  ].filter(Boolean)
};
