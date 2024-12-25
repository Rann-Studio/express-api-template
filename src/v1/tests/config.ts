/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    reporters: [
        "default",
        [
            "@tsdoc-test-reporter/jest",
            {
                outputFileName: `src/v1/tests/report/${new Date().toLocaleString('id-ID', { hour12: false }).replace(',', '').replace(/\//g, '-').replace(/:/g, '-')}`,
                uiOptions: {
                    htmlTitle: "API V1 Test Report",
                },
            },
        ],
    ],
};
