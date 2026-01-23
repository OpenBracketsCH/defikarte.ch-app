module.exports = {
  root: false,
  extends: ['@react-native-community', 'eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Your custom rules go here
  },
};
