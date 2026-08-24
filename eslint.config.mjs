import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'qa/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    rules: {
      // The site renders build-time constants (JSON-LD) through this. Every
      // call site is reviewed and none of them touch user input.
      'react/no-danger': 'off',
    },
  },
];
