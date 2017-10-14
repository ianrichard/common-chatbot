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
        } else if (messageConfig.type === 'image' || messageConfig.type === 'card') {
            googleResponse.richResponse.items = googleResponse.richResponse.items || [];
            let cardContent = {
                basicCard: {}
            };
            if (messageConfig.type === 'image' || messageConfig.image) {
                cardContent.basicCard.image = {
                    url: messageConfig.url || messageConfig.image.url,
                    accessibilityText: messageConfig.accessibilityText || messageConfig.title
                }
            }
            if (messageConfig.type === 'card') {
                cardContent.basicCard.title = messageConfig.title;
                cardContent.basicCard.subtitle = messageConfig.subTitle;
                // cardContent.basicCard.formattedText = messageConfig.body;
                if (messageConfig.button) {
                    cardContent.basicCard.buttons = [
                        {
                            title: messageConfig.button.title,
                            openUrlAction: {
                                url: messageConfig.button.url
                            }
                        }
                    ];
                }
            }
            googleResponse.richResponse.items.push(cardContent);
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
                googleResponse.systemIntent.data[`${messageConfig.type}Select`].items.push({
                    optionInfo: {
                        key: listItemConfig.key
                    },
                    title: listItemConfig.title,
                    description: listItemConfig.subTitle,
                    image: {
                        url: listItemConfig.imageUrl,
                        accessibilityText: listItemConfig.title
                    }
                });
            });
        }
    });
    return googleResponse;
}
