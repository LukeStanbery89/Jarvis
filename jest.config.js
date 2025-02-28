module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'ts', 'json', 'node'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverageFrom: [
        'server/**/*.{js,ts}',
        'client/**/*.{js,ts}',
        'shared/**/*.{js,ts}',
        '!src/**/*.d.ts', // Exclude TypeScript declaration files
    ],
};