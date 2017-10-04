export default function getBasicTextResponse(customResponseObject) {
    let basicTextResponse = '';
    customResponseObject.forEach((item, index) => {
        if (item.text) {
            if (index > 0) {
                basicTextResponse += ' ';
            }
            basicTextResponse += item.text;
        } else if (item.simpleResponses) {
            basicTextResponse += ' - ';
            item.simpleResponses.forEach((simpleResponse, innerIndex) => {
                basicTextResponse += simpleResponse;
                if (innerIndex < item.simpleResponses.length - 1) {
                    basicTextResponse += ', ';
                }
            });
        }
    });
    return basicTextResponse;
}