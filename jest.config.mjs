/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(ts|tsx)?$': ['ts-jest', {
            useESM: true,
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // Resolver la colisión del mapa Haste
    haste: {
        forceNodeFilesystemAPI: true
    },
    // Ignorar la carpeta .next
    testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/"
    ]
};

export default config;