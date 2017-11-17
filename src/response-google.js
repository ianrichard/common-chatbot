import logJsonToFile from './utils/log-json-to-file';

export default function getGoogleResponseObject(commonChatbotResponseArray) {
    let googleResponseObject = {
        richResponse: {
            items: []
        }
    };
    commonChatbotResponseArray.forEach((commonChatbotResponseItemObject, index) => {
        if (commonChatbotResponseItemObject.type == 'text') {
            googleResponseObject.richResponse.items = googleResponseObject.richResponse.items || [];
            googleResponseObject.richResponse.items.push({
                simpleResponse: {
                    textToSpeech: commonChatbotResponseItemObject.message
                }
            });
        } else if (commonChatbotResponseItemObject.type === 'simple-responses') {
            googleResponseObject.richResponse.suggestions = googleResponseObject.richResponse.suggestions || [];
            commonChatbotResponseItemObject.values.forEach((simpleResponse, innerIndex) => {
                googleResponseObject.richResponse.suggestions.push({
                    title: simpleResponse
                });
            });
        } else if (commonChatbotResponseItemObject.type === 'image' || commonChatbotResponseItemObject.type === 'card') {
            googleResponseObject.richResponse.items = googleResponseObject.richResponse.items || [];
            let cardContentObject = {
                basicCard: {}
            };
            if (commonChatbotResponseItemObject.type === 'image' || commonChatbotResponseItemObject.image) {
                cardContentObject.basicCard.image = {
                    url: commonChatbotResponseItemObject.url || commonChatbotResponseItemObject.image.url,
                    accessibilityText: commonChatbotResponseItemObject.accessibilityText || commonChatbotResponseItemObject.title
                }
            }
            if (commonChatbotResponseItemObject.type === 'card') {
                cardContentObject.basicCard.title = commonChatbotResponseItemObject.title;
                cardContentObject.basicCard.subtitle = commonChatbotResponseItemObject.subTitle;
                // cardContentObject.basicCard.formattedText = commonChatbotResponseItemObject.body;
                if (commonChatbotResponseItemObject.button) {
                    cardContentObject.basicCard.buttons = [
                        {
                            title: commonChatbotResponseItemObject.button.title,
                            openUrlAction: {
                                url: commonChatbotResponseItemObject.button.url
                            }
                        }
                    ];
                }
            }
            googleResponseObject.richResponse.items.push(cardContentObject);
        } else if (commonChatbotResponseItemObject.type === 'list' || commonChatbotResponseItemObject.type === 'carousel') {
            googleResponseObject.systemIntent = {
                intent: 'actions.intent.OPTION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec'
                }
            };

            // Google uses "listSelect" or "carouselSelect" for the different types
            googleResponseObject.systemIntent.data[`${commonChatbotResponseItemObject.type}Select`] = {
                items: []
            };

            commonChatbotResponseItemObject.options.forEach(listItemConfig => {
                let optionKey;
                googleResponseObject.systemIntent.data[`${commonChatbotResponseItemObject.type}Select`].items.push({
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
    logJsonToFile('google-response-object-log', googleResponseObject);
    return googleResponseObject;
}
