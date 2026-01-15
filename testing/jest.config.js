export default {
    testEnvironment: 'jsdom',
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.test.js',
        '<rootDir>/src/**/__tests__/**/*.js',
    ],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
