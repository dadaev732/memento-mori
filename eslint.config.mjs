// eslint.config.mjs
import tsparser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';

export default defineConfig([
    ...obsidianmd.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsparser,
            parserOptions: { project: './tsconfig.json' },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        // You can add your own configuration to override or add rules
        rules: {
            // example: turn off a rule from the recommended set
            'obsidianmd/sample-names': 'off',
            'obsidianmd/ui/sentence-case': 'warn',
        },
    },
]);
