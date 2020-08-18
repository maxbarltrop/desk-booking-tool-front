module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      node: true,
      mocha: true
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parser: 'babel-eslint',
  
    parserOptions: {
      ecmaVersion: 2018
    },
  
    rules: {
      "no-nested-ternary": 'off',
      'no-extra-parens': 'error',
      'no-undef-init': 'off',
      'no-undef': 'error',
      'no-undefined': 'off',
      'react/no-did-update-set-state': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'error',
      'no-use-before-define': 'error',
      'array-bracket-spacing': ['warn', 'always'],
      'block-spacing': ['warn', 'always'],
      'brace-style': ['warn', '1tbs', { allowSingleLine: false }],
      camelcase: 'warn',
      'comma-spacing': ['warn', { before: false, after: true }],
      indent: 'off',
      'max-depth': ['warn', 8],
      'max-len': ['warn', 132],
      quotes: ['warn', 'single'],
      'keyword-spacing': ['warn', { before: true, after: true }],
      'space-before-blocks': ['warn', 'always'],
      'space-before-function-paren': ['warn', 'never'],
      'space-in-parens': ['warn', 'never'],
      'space-infix-ops': ['warn', { int32Hint: true }],
      'space-unary-ops': 'error',
      'spaced-comment': ['warn', 'always'],
      'wrap-regex': 'warn',
      'linebreak-style': ['off'],
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/jsx-no-target-blank': 'off'
    }
  };