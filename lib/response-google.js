"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getGoogleResponse;
function getGoogleResponse(customResponseObject) {
    var googleResponse = {
        rich_response: {}
    };
    customResponseObject.forEach(function (item, index) {
        if (item.text) {
            googleResponse.rich_response.items = googleResponse.rich_response.items || [];
            googleResponse.rich_response.items.push({
                simpleResponse: {
                    textToSpeech: item.text
                }
            });
        } else if (item.simpleResponses) {
            googleResponse.rich_response.suggestions = googleResponse.rich_response.suggestions || [];
            item.simpleResponses.forEach(function (simpleResponse, innerIndex) {
                googleResponse.rich_response.suggestions.push({
                    title: simpleResponse
                });
            });
        } else if (item.imageUrl) {
            googleResponse.rich_response.items = googleResponse.rich_response.items || [];
            googleResponse.rich_response.items.push({
                basicCard: {
                    image: {
                        url: item.imageUrl,
                        accessibilityText: item.accessibilityText
                    }
                }
            });
        }
    });
    return googleResponse;
}