const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';
import getDialogflowBasicTextResponse from './response-dialogflow-basic';
import getFacebookResponseArray from './response-facebook';
import getGoogleResponseObject from './response-google';

export default function getDialogflowResponseObject(commonChatbotResponseArray, dialogflowIncomingObject) {

    // basic response types for Dialogflow web demo and text
    let dialogflowResponseObject = {
        speech: getDialogflowBasicTextResponse(commonChatbotResponseArray),
        displayText: getDialogflowBasicTextResponse(commonChatbotResponseArray)
    };

    logJsonToFile('dialogflow-basic-response-object-log', dialogflowResponseObject);

    if (dialogflowIncomingObject.originalRequest) {
        dialogflowResponseObject.data = {};
        if (dialogflowIncomingObject.originalRequest.source === 'facebook') {
            dialogflowResponseObject.data.facebook = getFacebookResponseArray(commonChatbotResponseArray);
        }
        else if (dialogflowIncomingObject.originalRequest.source === 'google') {
            dialogflowResponseObject.data.google = getGoogleResponseObject(commonChatbotResponseArray);
        }

        commonChatbotResponseArray.forEach((commonChatbotResponseItemObject, index) => {
            if (commonChatbotResponseItemObject.outputContext) {
                dialogflowResponseObject.contextOut = [
                    {
                        name: commonChatbotResponseItemObject.outputContext,
                        lifespan: 0,
                        parameters: null
                    }
                ];
            }
        });
    }
    
    logJsonToFile('dialogflow-response-object-log', dialogflowResponseObject);

    return dialogflowResponseObject;
}

