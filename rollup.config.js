import fs from 'fs';

import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
// import memory from 'rollup-plugin-memory';

const env = process.env.NODE_ENV

const DEV = env === 'development';

let format = process.env.FORMAT || 'cjs';
let pkg = JSON.parse(fs.readFileSync('./package.json'));
let external = (format === 'iife' || format === 'umd') ? [] : Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {})).concat(['lodash/throttle']);
let dest = pkg.main;

switch (format) {
  case 'es':
    dest = pkg.module;
    break;

  case 'iife':
    dest = pkg.browser.split('.js').join('.iife.js');
    break;

  case 'umd':
    dest = pkg.browser;
    break;

  case 'cjs':
    dest = pkg.main;
    break;

  default:
    break;
}

export default {
  entry: 'src/device.js',
  sourceMap: (format !== 'iife' && format !== 'umd'),
  dest,
  format,
  external,
  moduleName: pkg.amdName,
  useStrict: false,
  exports: format === 'es' ? null : 'named',
  plugins: [
    // eslint({
    //   include: [
    //     'src/**',
    //   ]
    // }),

    // format==='umd' && memory({
    //   path: 'src/device.js',
    //   contents: "export { default } from './device';"
    // }),
    resolve({
      jsnext: false, // Default: false
      main: true, // Default: true
      browser: false, // Default: false
      preferBuiltins: false,
      // browser: true
    }),

    babel({
      exclude: '**/node_modules/**'
    }),

    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),

    commonjs(),

    (((format === 'iife' || format === 'umd') && !DEV) && uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })),
  ].filter(Boolean)
};
