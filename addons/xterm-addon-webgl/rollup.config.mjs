import path from "path";
import { terser } from 'rollup-plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import alias from '@rollup/plugin-alias';

const addonName = 'WebglAddon';
const mainFile = 'xterm-addon-webgl.js';

export default {
  input: `./out/${addonName}.js`,
  output: {
    file: `./lib/${mainFile}`,
    format: 'es',
  },
  plugins: [
    resolve({
      preferBuiltins: false, // to avoid loading in-built Node.js modules
      extensions: ['.js']
    }),
    alias({
      entries: [
        { find: 'common', replacement: path.resolve('../../out/common') },
        { find: 'browser', replacement: path.resolve('../../out/browser') }
      ]
    }),
    commonjs(),
    sourcemaps(),
    terser({
      output: {
        comments: false
      }
    })
  ],
  onwarn: function(warning, warn) {
    // Ignore Unresolved dependencies warning for browser-stdout package
    if (warning.code === "UNRESOLVED_IMPORT") return;
    warn(warning);
  },
  external: ['fs', 'os', 'crypto'],
  treeshake: {
    moduleSideEffects: false
  }
};