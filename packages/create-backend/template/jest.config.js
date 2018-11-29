module.exports = {
    "roots": [
        "<rootDir>/tests",
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.ts?$": "ts-jest"
    },
    "testRegex": ".*\.test\.ts$",
    "moduleFileExtensions": [
        "ts",
        "js",
        "json",
        "node"
    ],
    "bail": true,
    "collectCoverageFrom": [
        "src/**/*.ts",
        "!src/**/index.ts",
    ]
}
