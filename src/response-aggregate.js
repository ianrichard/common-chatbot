const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';
import getBasicTextResponse from './response-basic';
import getFacebookResponse from './response-facebook';
import getGoogleResponse from './response-google';

export default function getResponseObjectForApiAi(customResponseObject, originalIncomingObjectFromApiAi) {
    
    // basic response types for api.ai web demo and text
    let responseObjectForApiAi = {
        speech: getBasicTextResponse(customResponseObject),
        displayText: getBasicTextResponse(customResponseObject)
    };

    logJsonToFile('basic-response', responseObjectForApiAi);

    if (originalIncomingObjectFromApiAi.originalRequest) {
        responseObjectForApiAi.data = {};
        if (originalIncomingObjectFromApiAi.originalRequest.source === 'facebook') {
            responseObjectForApiAi.data.facebook = getFacebookResponse(customResponseObject);
            logJsonToFile('facebook-response', responseObjectForApiAi.data.facebook);
        }
        else if (originalIncomingObjectFromApiAi.originalRequest.source === 'google') {
            responseObjectForApiAi.data.google = getGoogleResponse(customResponseObject);
            logJsonToFile('google-response', responseObjectForApiAi.data.google);
        }
    }
    
    logJsonToFile('combined-response', responseObjectForApiAi);

    return responseObjectForApiAi;
}

