export default function getGoogleResponse(messageConfigArray) {
    let googleResponse = {
        richResponse: {
            items: []
        }
    };
    messageConfigArray.forEach((messageConfig, index) => {
        if (messageConfig.type == 'text') {
            googleResponse.richResponse.items = googleResponse.richResponse.items || [];
            googleResponse.richResponse.items.push({
                simpleResponse: {
                    textToSpeech: messageConfig.message
                }
            });
        } else if (messageConfig.type === 'simple-responses') {
            googleResponse.richResponse.suggestions = googleResponse.richResponse.suggestions || [];
            messageConfig.values.forEach((simpleResponse, innerIndex) => {
                googleResponse.richResponse.suggestions.push({
                    title: simpleResponse
                });
            });
        } else if (messageConfig.type === 'image') {
            googleResponse.richResponse.items = googleResponse.richResponse.items || [];
            googleResponse.richResponse.items.push({
                basicCard: {
                    image: {
                        url: messageConfig.url,
                        accessibilityText: messageConfig.accessibilityText
                    }
                }
            });
        } else if (messageConfig.type === 'list' || messageConfig.type === 'carousel') {
            googleResponse.systemIntent = {
                intent: 'actions.intent.OPTION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec'
                }
            };

            // Google uses "listSelect" or "carouselSelect" for the different types
            googleResponse.systemIntent.data[`${messageConfig.type}Select`] = {
                items: []
            };

            messageConfig.options.forEach(listItemConfig => {
                let optionKey;
                if (listItemConfig.button) {
                    optionKey = listItemConfig.button.action;
                }
                googleResponse.systemIntent.data[`${messageConfig.type}Select`].items.push({
                    optionInfo: {
                        key: optionKey
                    },
                    title: listItemConfig.title,
                    description: listItemConfig.subTitle,
                    image: {
                        url: listItemConfig.imageUrl
                    }
                });
            });
        }
    });
    return googleResponse;
}
