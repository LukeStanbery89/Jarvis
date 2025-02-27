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
        'src/**/*.{js,ts}', // Include all JavaScript and TypeScript files in the src directory
        '!src/**/*.d.ts',   // Exclude TypeScript declaration files
    ],
};