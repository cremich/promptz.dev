import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    '@/data/prompts.json': "<rootDir>/__mocks__/data/prompts.json",
    '@/data/agents.json': "<rootDir>/__mocks__/data/agents.json",
    '@/data/powers.json': "<rootDir>/__mocks__/data/powers.json",
    '@/data/steering.json': "<rootDir>/__mocks__/data/steering.json",
    '@/data/hooks.json': "<rootDir>/__mocks__/data/hooks.json"
  },
  // Coverage configuration for 100% enforcement
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: [
    "text",
    "text-summary",
    "html",
    "lcov",
    "json"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  // Fail tests if coverage thresholds are not met
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/",
    "\\.d\\.ts$",
    "/components/ui/*"
  ]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
