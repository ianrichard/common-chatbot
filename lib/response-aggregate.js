'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getResponseObjectForApiAi;

var _logJsonToFile = require('./utils/log-json-to-file');

var _logJsonToFile2 = _interopRequireDefault(_logJsonToFile);

var _responseBasic = require('./response-basic');

var _responseBasic2 = _interopRequireDefault(_responseBasic);

var _responseFacebook = require('./response-facebook');

var _responseFacebook2 = _interopRequireDefault(_responseFacebook);

var _responseGoogle = require('./response-google');

var _responseGoogle2 = _interopRequireDefault(_responseGoogle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
function getResponseObjectForApiAi(customResponseObject, originalIncomingObjectFromApiAi) {

    // basic response types for api.ai web demo and text
    var responseObjectForApiAi = {
        speech: (0, _responseBasic2.default)(customResponseObject),
        displayText: (0, _responseBasic2.default)(customResponseObject)
    };

    (0, _logJsonToFile2.default)('basic-response', responseObjectForApiAi);

    if (originalIncomingObjectFromApiAi.originalRequest) {
        responseObjectForApiAi.data = {};
        if (originalIncomingObjectFromApiAi.originalRequest.source === 'facebook') {
            responseObjectForApiAi.data.facebook = (0, _responseFacebook2.default)(customResponseObject);
            (0, _logJsonToFile2.default)('facebook-response', responseObjectForApiAi.data.facebook);
        } else if (originalIncomingObjectFromApiAi.originalRequest.source === 'google') {
            responseObjectForApiAi.data.google = (0, _responseGoogle2.default)(customResponseObject);
            (0, _logJsonToFile2.default)('google-response', responseObjectForApiAi.data.google);
        }
    }

    (0, _logJsonToFile2.default)('combined-response', responseObjectForApiAi);

    return responseObjectForApiAi;
}