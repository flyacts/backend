/*!
 * @copyright FLYACTS GmbH 2018
 */

// tslint:disable:no-any no-identical-functions one-variable-per-declaration

const request = require('supertest');
import http = require('http');

request.Test.prototype._assertStatus = function(status: any, res: any) {
    if (res.status !== status) {
        const expectedStatus = http.STATUS_CODES[status];
        const actualStatus = http.STATUS_CODES[res.status];
        let errorMessage = `expected ${status} "${expectedStatus}", got ${res.status} "${actualStatus}"`;

        // errorMessage.body = res.body;
        // Add a more useful error message.
        if (res.error) {
            errorMessage += `
Response: \'${res.body.message}\'`;

            if (res.body.stack) {
                errorMessage += `

Remote Stack was:
${res.body.stack}
`;
            }
        }

        return new Error(errorMessage);
    } else {
        return;
    }
};

module.exports = request;
