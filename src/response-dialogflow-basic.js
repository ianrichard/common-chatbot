import logJsonToFile from './utils/log-json-to-file';

export default function getDialogflowBasicTextResponse(commonChatbotResponseArray) {
    let basicTextResponse = '';
    commonChatbotResponseArray.forEach((commonChatbotResponseItemObject, index) => {
        if (commonChatbotResponseItemObject.type == 'text') {
            basicTextResponse += `${commonChatbotResponseItemObject.message} `;
        } else if (commonChatbotResponseItemObject.type === 'simple-responses') {
            basicTextResponse += ' | You can respond - ';
            commonChatbotResponseItemObject.values.forEach((simpleResponse, innerIndex) => {
                basicTextResponse += `"${simpleResponse}"`;
                if (innerIndex === commonChatbotResponseItemObject.values.length - 2) {
                    basicTextResponse += ' or ';
                } else if (innerIndex < commonChatbotResponseItemObject.values.length - 1) {
                    basicTextResponse += ', ';
                }
            });
        } else if (commonChatbotResponseItemObject.type === 'image') {
            basicTextResponse += ` Image of ${commonChatbotResponseItemObject.accessibilityText || commonChatbotResponseItemObject.title}`;
        } else if (commonChatbotResponseItemObject.type === 'card') {
            basicTextResponse += `${commonChatbotResponseItemObject.title} `;
            if (commonChatbotResponseItemObject.subTitle) {
                basicTextResponse += `- ${commonChatbotResponseItemObject.subTitle} `;
            }
        } else if (commonChatbotResponseItemObject.type === 'list' || commonChatbotResponseItemObject.type === 'carousel') {
            commonChatbotResponseItemObject.options.forEach((listItemConfig, innerIndex) => {
                basicTextResponse += listItemConfig.title;
                // if (listItemConfig.subTitle) {
                //     basicTextResponse += ` (${listItemConfig.subTitle})`;
                // }
                if (innerIndex === commonChatbotResponseItemObject.options.length - 2) {
                    basicTextResponse += ' or ';
                } else if (innerIndex < commonChatbotResponseItemObject.options.length - 1) {
                    basicTextResponse += ', ';
                }
            });
        }
    });
    logJsonToFile('dialogflow-basic-text-response-log', basicTextResponse);
    return basicTextResponse;
}