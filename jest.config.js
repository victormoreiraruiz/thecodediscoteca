module.exports = {
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules', '<rootDir>/resources/js'],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/resources/js/$1', // Mapea el alias @ al directorio correcto
    },
};
