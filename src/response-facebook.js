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
        else if (item.image) {
            facebookResponse.push({
                attachment: {
                    type: 'image',
                    payload: {
                        url: item.image
                    }
                }
            });
        }
    }); 
    return facebookResponse;
}