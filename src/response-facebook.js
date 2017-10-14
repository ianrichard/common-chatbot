export default function getFacebookResponse(messageConfigArray) {
    let facebookResponse = [];
    messageConfigArray.forEach((messageConfig, index) => {
        if (messageConfig.type === 'text') {
            facebookResponse.push({
                text: messageConfig.message
            });
        } else if (messageConfig.type === 'simple-responses') {
            facebookResponse[index - 1].quick_replies = [];
            messageConfig.values.forEach((simpleResponse, innerIndex) => {
                facebookResponse[index - 1].quick_replies.push({
                    content_type: 'text',
                    title: simpleResponse,
                    payload: simpleResponse
                });
            });
        } else if (messageConfig.type === 'image') {
            facebookResponse.push({
                attachment: {
                    type: 'image',
                    payload: {
                        url: messageConfig.url
                    }
                }
            });
        } else if (messageConfig.type === 'card') {

            let cardContent = {
                title: messageConfig.title,
                subtitle: messageConfig.subTitle,
                image_url: messageConfig.image.url
            };
            if (messageConfig.button) {
                cardContent.buttons = [ getFacebookButtonObject(messageConfig.button) ];
            }
            facebookResponse.push({
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [cardContent]
                    }
                }
            });
        } else if (messageConfig.type === 'list' || messageConfig.type === 'carousel') {
            let facebookListResponseObject = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: messageConfig.type === 'list' ? 'list' : 'generic',
                        top_element_style: messageConfig.type === 'list' ? messageConfig.facebookTopElementStyle || 'compact' : undefined,
                        elements: []
                    }
                }
            };

            messageConfig.options.forEach(listItemConfig => {
                let facebookElementObject = {
                    title: listItemConfig.subTitle,
                    image_url: listItemConfig.imageUrl
                };

                facebookElementObject.buttons = [
                    {
                        type: 'postback',
                        payload: listItemConfig.title,
                        title: listItemConfig.title
                    }
                ];

                facebookListResponseObject.attachment.payload.elements.push(facebookElementObject);
            });

            facebookResponse.push(facebookListResponseObject);
        }
    });
    return facebookResponse;
}

function getFacebookButtonObject(buttonConfig) {
    let facebookButtonObject = {
        title: buttonConfig.title
    };
    if (buttonConfig.url) {
        facebookButtonObject.type = 'web_url';
        facebookButtonObject.url = buttonConfig.url;
        facebookButtonObject.webview_height_ratio = buttonConfig.facebookWebviewHeight || 'tall';
    } else if (buttonConfig.action) {
        facebookButtonObject.type = 'postback';
        facebookButtonObject.payload = buttonConfig.action;
    }
    return facebookButtonObject;
}
