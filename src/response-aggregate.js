const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';
import getBasicTextResponse from './response-basic';
import getFacebookResponse from './response-facebook';
import getGoogleResponse from './response-google';

export default function getResponseObjectForDialogflow(messageConfigArray, originalIncomingObjectFromDialogflow) {

    // basic response types for Dialogflow web demo and text
    let responseObjectForDialogflow = {
        speech: getBasicTextResponse(messageConfigArray),
        displayText: getBasicTextResponse(messageConfigArray)
    };

    logJsonToFile('response-basic-log', responseObjectForDialogflow);

    if (originalIncomingObjectFromDialogflow.originalRequest) {
        responseObjectForDialogflow.data = {};
        if (originalIncomingObjectFromDialogflow.originalRequest.source === 'facebook') {
            responseObjectForDialogflow.data.facebook = getFacebookResponse(messageConfigArray);
            logJsonToFile('response-facebook-log', responseObjectForDialogflow.data.facebook);
        }
        else if (originalIncomingObjectFromDialogflow.originalRequest.source === 'google') {
            responseObjectForDialogflow.data.google = getGoogleResponse(messageConfigArray);
            logJsonToFile('response-google-log', responseObjectForDialogflow.data.google);
        }

        messageConfigArray.forEach((messageConfig, index) => {
            if (messageConfig.outputContext) {
                responseObjectForDialogflow.contextOut = [
                    {
                        name: messageConfig.outputContext,
                        lifespan: 0,
                        parameters: null
                    }
                ];
            }
        });
    }
    
    logJsonToFile('response-combined-log', responseObjectForDialogflow);

    return responseObjectForDialogflow;
}

