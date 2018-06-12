module.exports = {
    "roots": [
        "<rootDir>/test/unit",
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
}