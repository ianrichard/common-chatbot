'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getBasicTextResponse;
function getBasicTextResponse(customResponseObject) {
    var basicTextResponse = '';
    customResponseObject.forEach(function (item, index) {
        if (item.text) {
            if (index > 0) {
                basicTextResponse += ' ';
            }
            basicTextResponse += item.text;
        } else if (item.simpleResponses) {
            basicTextResponse += ' - ';
            item.simpleResponses.forEach(function (simpleResponse, innerIndex) {
                basicTextResponse += simpleResponse;
                if (innerIndex < item.simpleResponses.length - 1) {
                    basicTextResponse += ', ';
                }
            });
        }
    });
    return basicTextResponse;
}