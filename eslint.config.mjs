import { defineConfig } from "eslint/config";
import globals from "globals";
import pluginVue from 'eslint-plugin-vue';
import js from '@eslint/js';

export default defineConfig([
  // Ignore 'vite build' product
  {
    ignores: ['dist/**']
  },
  // globals
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser }
  },
  // js recommended
  {
    files: ['src/**/*.js'],
    plugins: { js },
    extends: ['js/recommended']
  },
  // vue recommended
  {
    files: ['src/**/*.vue'],
    plugins: { pluginVue },
    extends: ['pluginVue/recommended']
  }
]);
