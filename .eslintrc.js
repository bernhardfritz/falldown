module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'import'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ],
    rules: {
        '@typescript-eslint/no-empty-function': [
            'error',
            {
                allow: [
                    'private-constructors'
                ]
            }
        ],
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ]
    }
};