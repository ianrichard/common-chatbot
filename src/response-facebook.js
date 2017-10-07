export default function getFacebookResponse(customResponseObject) {
    let facebookResponse = [];
    customResponseObject.forEach((item, index) => {
        if (item.text) {
            facebookResponse.push(item);
        } 
        else if (item.simpleResponses) {
            facebookResponse[index -1].quick_replies = [];
            item.simpleResponses.forEach((simpleResponse, innerIndex) => {
                facebookResponse[index - 1].quick_replies.push({
                    content_type: 'text',
                    title: simpleResponse,
                    payload: simpleResponse
                });
            });
        }
        else if (item.imageUrl) {
            facebookResponse.push({
                attachment: {
                    type: 'image',
                    payload: {
                        url: item.imageUrl
                    }
                }
            });
        }
        else if (item.list) {

            const listConfig = item.list;

            let facebookListResponseObject = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'list',
                        top_element_style: listConfig.facebookTopElementStyle || 'compact',
                        elements: []
                    }
                }
            };

            listConfig.options.forEach((listItemConfig) => {
                let facebookElementObject = {
                    title: listItemConfig.title,
                    subtitle: listItemConfig.subTitle,
                    image_url: listItemConfig.imageUrl
                };
                if (listItemConfig.button) {
                    facebookElementObject.buttons = [ getFacebookButtonObject(listItemConfig.button) ];
                }
                facebookListResponseObject.attachment.payload.elements.push(facebookElementObject);
            });

            if (listConfig.standaloneButton) {
                facebookListResponseObject.attachment.payload.buttons = [ getFacebookButtonObject(listConfig.standaloneButton) ];
            }

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
        if (buttonConfig.facebookWebviewHeight) {
            facebookButtonObject.webview_height_ratio = buttonConfig.facebookWebviewHeight;
        }
    } else {
        facebookButtonObject.type = 'postback';
        facebookButtonObject.payload = buttonConfig.action;
    }
    return facebookButtonObject;
}