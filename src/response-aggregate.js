const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';
import getBasicTextResponse from './response-basic';
import getFacebookResponse from './response-facebook';
import getGoogleResponse from './response-google';

export default function getResponseObjectForDialogflow(customResponseObject, originalIncomingObjectFromDialogflow) {
    
    // basic response types for api.ai web demo and text
    let responseObjectForDialogflow = {
        speech: getBasicTextResponse(customResponseObject),
        displayText: getBasicTextResponse(customResponseObject)
    };

    logJsonToFile('response-basic-log', responseObjectForDialogflow);

    if (originalIncomingObjectFromDialogflow.originalRequest) {
        responseObjectForDialogflow.data = {};
        if (originalIncomingObjectFromDialogflow.originalRequest.source === 'facebook') {
            responseObjectForDialogflow.data.facebook = getFacebookResponse(customResponseObject);
            logJsonToFile('response-facebook-log', responseObjectForDialogflow.data.facebook);
        }
        else if (originalIncomingObjectFromDialogflow.originalRequest.source === 'google') {
            responseObjectForDialogflow.data.google = getGoogleResponse(customResponseObject);
            logJsonToFile('response-google-log', responseObjectForDialogflow.data.google);
        }
    }
    
    logJsonToFile('response-combined-log', responseObjectForDialogflow);

    return responseObjectForDialogflow;
}

