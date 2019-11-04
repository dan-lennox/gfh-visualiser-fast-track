import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default (async () => {
  const env = process.env.ROLLUP_WATCH ? 'development' : 'production';

  return {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      sourcemap: process.env.ROLLUP_WATCH,
      name: 'visualiser',
      // Fixes modules built with Browserify which declare a 'global' as an alias for 'window'.
      intro: "const global = window;",
    },
    plugins: [
      postcss({
        plugins: [
          env === 'production' && (await import('cssnano')).default()
        ],
        extract: true
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
        'GFHAPI': process.env.USE_MOCK_API ? 'MockGFHAPI' : 'GFHAPI'
      }),
      builtins(),
      resolve({
        preferBuiltins: true,
        browser: true,
        // alias: {
        //   'readable-stream': require.resolve('rollup-plugin-node-builtins/src/es6/stream.js')
        // }
      }),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/react/index.js': ['Component', 'useRef', 'forwardRef', 'createContext', 'useEffect', 'useReducer', 'useContext', 'PureComponent', 'useMemo', 'Fragment', 'Children', 'useLayoutEffect', 'createElement'],
          'node_modules/react-dom/index.js': ['unstable_batchedUpdates'],
          'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer'],
          'node_modules/cloudinary-react/lib/index.js': ['Image', 'Transformation'],
          'node_modules/cloudinary-core/cloudinary-core.js': ['cloudinary']
        }
      }),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          '@babel/preset-react',
          [
            '@babel/preset-env',
            {
              modules: false,
              useBuiltIns: 'usage',
              corejs: 3
            }
          ]
        ],
        plugins: ['@babel/plugin-proposal-optional-chaining'],
      }),
      globals(),
      // Minify for production builds.
      env === 'production' && (await import('rollup-plugin-terser')).terser()
    ],
  };
})();