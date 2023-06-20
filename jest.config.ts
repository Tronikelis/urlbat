import { JestConfigWithTsJest } from "ts-jest";

export default {
    preset: "ts-jest",
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverage: true,
    testMatch: ["**/test/**/*.ts"],
    verbose: true,
    collectCoverageFrom: ["**/src/**/*.ts"],
    testPathIgnorePatterns: ["dist.*\\.ts$"],
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
} satisfies JestConfigWithTsJest;
