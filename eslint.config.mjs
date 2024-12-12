export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // Integrates Prettier as an ESLint rule
    'react/react-in-jsx-scope': 'off', // Not required in React 17+
    '@typescript-eslint/no-unused-vars': 'warn', // Warn on unused variables
  },
  settings: {
    react: {
      version: 'detect', // Automatically detects React version
    },
  },
};
