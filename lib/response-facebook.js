'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getFacebookResponse;
function getFacebookResponse(messageConfigArray) {
    var facebookResponse = [];
    messageConfigArray.forEach(function (messageConfig, index) {
        if (messageConfig.type === 'text') {
            facebookResponse.push({
                text: messageConfig.message
            });
        } else if (messageConfig.type === 'simple-responses') {
            facebookResponse[index - 1].quick_replies = [];
            messageConfig.values.forEach(function (simpleResponse, innerIndex) {
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

            var cardContent = {
                title: messageConfig.title,
                subtitle: messageConfig.subTitle,
                image_url: messageConfig.image.url
            };
            if (messageConfig.button) {
                cardContent.buttons = [getFacebookButtonObject(messageConfig.button)];
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
            var facebookListResponseObject = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: messageConfig.type === 'list' ? 'list' : 'generic',
                        top_element_style: messageConfig.type === 'list' ? messageConfig.facebookTopElementStyle || 'compact' : undefined,
                        elements: []
                    }
                }
            };

            messageConfig.options.forEach(function (listItemConfig) {
                var facebookElementObject = {
                    title: listItemConfig.title,
                    subtitle: listItemConfig.subTitle,
                    image_url: listItemConfig.imageUrl
                };
                if (listItemConfig.button) {
                    // even though Facebook Messenger list items can load web URLs, this interaction doesn't match Google
                    // so for sake of consistency, this forces the experience to be the same
                    // webviews can be invoked from cards
                    facebookElementObject.default_action = {
                        type: 'web_url',
                        url: listItemConfig.button.url,
                        // messenger_extensions: true,
                        webview_height_ratio: 'tall'
                        // fallback_url: 'https://peterssendreceiveapp.ngrok.io/'
                    };
                }
                facebookListResponseObject.attachment.payload.elements.push(facebookElementObject);
            });

            // This behavior doesn't exist in Google Assistant, and honestly, it's a bit weird IMO
            // if (messageConfig.standaloneButton) {
            //     facebookListResponseObject.attachment.payload.buttons = [ getFacebookButtonObject(messageConfig.standaloneButton) ];
            // }

            facebookResponse.push(facebookListResponseObject);
        }
    });
    return facebookResponse;
}

function getFacebookButtonObject(buttonConfig, type) {
    var facebookButtonObject = {
        title: buttonConfig.title
    };
    if (buttonConfig.url || type !== 'postback') {
        facebookButtonObject.type = 'web_url';
        facebookButtonObject.url = buttonConfig.url;
        if (buttonConfig.facebookWebviewHeight) {
            facebookButtonObject.webview_height_ratio = buttonConfig.facebookWebviewHeight;
        }
    } else {
        facebookButtonObject.type = 'postback';
        facebookButtonObject.payload = buttonConfig.action;
    }
    return facebookButtonObject;
}