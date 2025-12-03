module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@next/next/no-img-element': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'prefer-const': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-template': 'warn',
    'template-curly-spacing': 'warn',
    'arrow-spacing': 'warn',
    'no-duplicate-imports': 'off',
    'sort-imports': 'off',
    'import/order': 'off',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '*.config.js',
    '*.config.ts',
  ],
};
