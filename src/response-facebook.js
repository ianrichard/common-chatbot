import logJsonToFile from "./utils/log-json-to-file";

export default function getFacebookResponseArray(commonChatbotResponseArray) {
    let facebookResponseArray = [];
    commonChatbotResponseArray.forEach((commonChatbotResponseItemObject, index) => {
        if (commonChatbotResponseItemObject.type === 'text') {
            facebookResponseArray.push({
                text: commonChatbotResponseItemObject.message
            });
        } else if (commonChatbotResponseItemObject.type === 'simple-responses') {
            facebookResponseArray[index - 1].quick_replies = [];
            commonChatbotResponseItemObject.values.forEach((simpleResponse, innerIndex) => {
                facebookResponseArray[index - 1].quick_replies.push({
                    content_type: 'text',
                    title: simpleResponse,
                    payload: simpleResponse
                });
            });
        } else if (commonChatbotResponseItemObject.type === 'image') {
            facebookResponseArray.push({
                attachment: {
                    type: 'image',
                    payload: {
                        url: commonChatbotResponseItemObject.url
                    }
                }
            });
        } else if (commonChatbotResponseItemObject.type === 'card') {

            let cardContentObject = {
                title: commonChatbotResponseItemObject.title,
                subtitle: commonChatbotResponseItemObject.subTitle,
                image_url: commonChatbotResponseItemObject.image.url
            };
            if (commonChatbotResponseItemObject.button) {
                cardContentObject.buttons = [ getFacebookButtonObject(commonChatbotResponseItemObject.button) ];
            }
            facebookResponseArray.push({
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [cardContentObject]
                    }
                }
            });
        } else if (commonChatbotResponseItemObject.type === 'list' || commonChatbotResponseItemObject.type === 'carousel') {
            let listObject = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: commonChatbotResponseItemObject.type === 'list' ? 'list' : 'generic',
                        top_element_style: commonChatbotResponseItemObject.type === 'list' ? commonChatbotResponseItemObject.facebookTopElementStyle || 'compact' : undefined,
                        elements: []
                    }
                }
            };

            commonChatbotResponseItemObject.options.forEach(listItemConfig => {
                let elementObject = {
                    title: listItemConfig.subTitle,
                    image_url: listItemConfig.imageUrl
                };

                elementObject.buttons = [
                    {
                        type: 'postback',
                        payload: listItemConfig.title,
                        title: listItemConfig.title
                    }
                ];

                listObject.attachment.payload.elements.push(elementObject);
            });

            facebookResponseArray.push(listObject);
        }
    });
    logJsonToFile('facebook-response-array-log', facebookResponseArray);
    return facebookResponseArray;
}

function getFacebookButtonObject(buttonConfigObject) {
    let buttonObject = {
        title: buttonConfigObject.title
    };
    if (buttonConfigObject.url) {
        buttonObject.type = 'web_url';
        buttonObject.url = buttonConfigObject.url;
        buttonObject.webview_height_ratio = buttonConfigObject.facebookWebviewHeight || 'tall';
        buttonObject.messenger_extensions = true;
    } else if (buttonConfigObject.action) {
        buttonObject.type = 'postback';
        buttonObject.payload = buttonConfigObject.action;
    }
    return buttonObject;
}
