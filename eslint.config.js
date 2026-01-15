module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: ['src/types/types.ts', 'script/generateSchema.js', 'cypress', 'node_modules', 'build/*'],
  rules: {
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    /**
     * Flagging variables that are declared using let keyword, but never reassigned after the initial assignment.
     */
    'prefer-const': 'error',
    /**
     * Disallow unused variables, functions, and function parameters.
     */
    'no-unused-vars': 'warn',
    /**
     * Disallows calling some Object.prototype methods directly on object instances.
     */
    'no-prototype-builtins': 'warn',
    /**
     * Disallows lexical declarations (let, const, function and class) in case/default clauses.
     */
    'no-case-declarations': 'warn',
    /**
     * Disallow missing props validation in a React component definition (react/prop-types)
     */
    'react/prop-types': 'off',
    /**
     * Allow unescaped >, ", ' or } inside components
     */
    'react/no-unescaped-entities': 'off',
    /**
     * Where jsx appears, React must be imported
     */
    'react/react-in-jsx-scope': 'off',
    /**
     * Component must have displayName attribute
     * @reason It is not mandatory to write displayName
     */
    'react/display-name': 'off',
    /**
     * Disable useless quotes in jsx
     */
    'react/jsx-curly-brace-presence': ['error', 'never'],
    /**
     * Duplicate props are prohibited
     */
    'react/jsx-no-duplicate-props': 'error',
    /**
     * When using && to render components, the forbidden condition is 0 '' or NaN
     */
    'react/jsx-no-leaked-render': 'warn',
    /**
     * Component names must conform to PascalCase
     */
    'react/jsx-pascal-case': 'error',
    /**
     * Fix no-unused-vars not checking jsx
     */
    'react/jsx-uses-vars': 'error',
    /**
     * It is forbidden to create two components in one file
     */
    'react/no-multi-comp': 'off',
    /**
     * Must use functional components
     */
    'react/prefer-stateless-function': 'warn',
    /**
     * Disallow unused variables.
     */
    '@typescript-eslint/no-unused-vars': 'warn',
    /**
     * Disallow `@ts-<directive>` comments or require descriptions after directives.
     */
    '@typescript-eslint/ban-ts-comment': 'off',
    /**
     * Require explicit return types on functions and class methods.
     */
    '@typescript-eslint/explicit-function-return-type': 'off',
    /**
     * Disallow the `any` type
     */
    '@typescript-eslint/no-explicit-any': 'off',
    /**
     * Require explicit return and argument types on exported functions' and classes' public class methods.
     */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    /**
     * Disallow empty functions.
     */
    '@typescript-eslint/no-empty-function': 'warn',
    /**
     * Disallow certain types to use lower-case primitives for consistency
     */
    '@typescript-eslint/ban-types': 'off',
  },
};
