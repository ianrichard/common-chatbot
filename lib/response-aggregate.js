'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getResponseObjectForDialogflow;

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
function getResponseObjectForDialogflow(customResponseObject, originalIncomingObjectFromDialogflow) {

    // basic response types for api.ai web demo and text
    var responseObjectForDialogflow = {
        speech: (0, _responseBasic2.default)(customResponseObject),
        displayText: (0, _responseBasic2.default)(customResponseObject)
    };

    (0, _logJsonToFile2.default)('response-basic-log', responseObjectForDialogflow);

    if (originalIncomingObjectFromDialogflow.originalRequest) {
        responseObjectForDialogflow.data = {};
        if (originalIncomingObjectFromDialogflow.originalRequest.source === 'facebook') {
            responseObjectForDialogflow.data.facebook = (0, _responseFacebook2.default)(customResponseObject);
            (0, _logJsonToFile2.default)('response-facebook-log', responseObjectForDialogflow.data.facebook);
        } else if (originalIncomingObjectFromDialogflow.originalRequest.source === 'google') {
            responseObjectForDialogflow.data.google = (0, _responseGoogle2.default)(customResponseObject);
            (0, _logJsonToFile2.default)('response-google-log', responseObjectForDialogflow.data.google);
        }
    }

    (0, _logJsonToFile2.default)('response-combined-log', responseObjectForDialogflow);

    return responseObjectForDialogflow;
}