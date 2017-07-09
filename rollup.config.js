import fs from 'fs';
// import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
// import uglify from 'rollup-plugin-uglify';
// import memory from 'rollup-plugin-memory';

const env = process.env.NODE_ENV;
// const DEV = env === 'development';


let pkg = JSON.parse(fs.readFileSync('./package.json'));
const external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {})).concat(['lodash/throttle']);;


export default {
  entry: 'src/device.js',
  sourceMap: true,
  useStrict: false,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: false,
      preferBuiltins: false,
    }),
    // babel({
    //   exclude: '**/node_modules/**'
    // }),
    buble(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),

    commonjs(),


  ],
  targets: [
      { dest: pkg.main, format: 'cjs', exports: 'named' },
      { dest: pkg.module, format: 'es',  external, exports: 'named' },
      { dest: pkg['umd:main'], format: 'umd', moduleName: pkg.moduleName, exports: 'named' }
    ]
};

// eslint({
    //   include: [
    //     'src/**',
    //   ]
    // }),
    // format==='umd' && memory({
    //   path: 'src/index.js',
    //   contents: "export { default } from './device';"
    // }),
// babel({
    //   exclude: '**/node_modules/**'
    // }),
