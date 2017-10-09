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

    logJsonToFile('response-basic-log', responseObjectForApiAi);

    if (originalIncomingObjectFromApiAi.originalRequest) {
        responseObjectForApiAi.data = {};
        if (originalIncomingObjectFromApiAi.originalRequest.source === 'facebook') {
            responseObjectForApiAi.data.facebook = getFacebookResponse(customResponseObject);
            logJsonToFile('response-facebook-log', responseObjectForApiAi.data.facebook);
        }
        else if (originalIncomingObjectFromApiAi.originalRequest.source === 'google') {
            responseObjectForApiAi.data.google = getGoogleResponse(customResponseObject);
            logJsonToFile('response-google-log', responseObjectForApiAi.data.google);
        }
    }
    
    logJsonToFile('response-combined-log', responseObjectForApiAi);

    return responseObjectForApiAi;
}

