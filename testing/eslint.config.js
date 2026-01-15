import js from '@eslint/js';

export default [
    {
        ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                window: 'readonly',
                navigator: 'readonly',
                Event: 'readonly',
            },
        },
        rules: {
            'no-restricted-syntax': [
                'error',
                'LabeledStatement',
                'WithStatement',
            ],
        },
    },
    {
        files: ['**/*.test.js', '**/__tests__/**/*.js', 'e2e/**/*.test.js'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly',
            },
        },
    },
];
