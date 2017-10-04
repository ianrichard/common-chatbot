export default function getGoogleResponse(customResponseObject) {
    let googleResponse = { 
        rich_response: {}
    };
    customResponseObject.forEach((item, index) => {
        if (item.text) {
            googleResponse.rich_response.items = googleResponse.rich_response.items || [];
            googleResponse.rich_response.items.push({
                simpleResponse: {
                    textToSpeech: item.text
                }
            });
        } 
        else if (item.simpleResponses) {
            googleResponse.rich_response.suggestions = googleResponse.rich_response.suggestions || [];
            item.simpleResponses.forEach((simpleResponse, innerIndex) => {
                googleResponse.rich_response.suggestions.push({
                    title: simpleResponse
                });
            });
        } 
        else if (item.image) {
            googleResponse.rich_response.items = googleResponse.rich_response.items || [];
            googleResponse.rich_response.items.push({
                basicCard: {
                    image: {
                        url: item.image,
                        accessibilityText: item.accessibilityText
                    }  
                }                
            });
        }
    });
    return googleResponse;
}