import { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  coverageProvider: 'v8',
};

export default config;
