import type { Config } from "jest";

const config: Config = {
	collectCoverage: true,
	collectCoverageFrom: ["**/src/**/*.ts"],
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.test.ts"],
	verbose: true,
};

export default config;
