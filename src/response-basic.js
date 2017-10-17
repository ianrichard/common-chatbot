export default function getBasicTextResponse(messageConfigArray) {
    let basicTextResponse = '';
    messageConfigArray.forEach((messageConfig, index) => {
        if (messageConfig.type == 'text') {
            basicTextResponse += `${messageConfig.message} `;
        } else if (messageConfig.type === 'simple-responses') {
            basicTextResponse += ' | You can respond - ';
            messageConfig.values.forEach((simpleResponse, innerIndex) => {
                basicTextResponse += `"${simpleResponse}"`;
                if (innerIndex === messageConfig.values.length - 2) {
                    basicTextResponse += ' or ';
                } else if (innerIndex < messageConfig.values.length - 1) {
                    basicTextResponse += ', ';
                }
            });
        } else if (messageConfig.type === 'image') {
            basicTextResponse += ` Image of ${messageConfig.accessibilityText || messageConfig.title}`;
        } else if (messageConfig.type === 'card') {
            basicTextResponse += `${messageConfig.title} `;
            if (messageConfig.subTitle) {
                basicTextResponse += `- ${messageConfig.subTitle} `;
            }
        } else if (messageConfig.type === 'list' || messageConfig.type === 'carousel') {
            messageConfig.options.forEach((listItemConfig, innerIndex) => {
                basicTextResponse += listItemConfig.title;
                // if (listItemConfig.subTitle) {
                //     basicTextResponse += ` (${listItemConfig.subTitle})`;
                // }
                if (innerIndex === messageConfig.options.length - 2) {
                    basicTextResponse += ' or ';
                } else if (innerIndex < messageConfig.options.length - 1) {
                    basicTextResponse += ', ';
                }
            });
        }
    });
    return basicTextResponse;
}