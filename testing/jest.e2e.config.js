export default {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/e2e/**/*.test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
