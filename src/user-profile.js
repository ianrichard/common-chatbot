const https = require('https');
const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';

let userProfileObject = {
    firstName: '',
    lastName: '',
    profilePic: ''
};

// TODO - decouple from Dialogflow
export function setUserProfileObject(dialogflowIncomingObject, profileConfigObject) {

    return new Promise((resolve, reject) => {

        if (dialogflowIncomingObject.originalRequest && dialogflowIncomingObject.originalRequest.source === 'facebook') {

            const facebookAccessToken = profileConfigObject.facebookAccessToken;
            const facebookUserId = dialogflowIncomingObject.originalRequest.data.sender.id;
            const url = `https://graph.facebook.com/v2.6/${facebookUserId}?fields=first_name,last_name,profile_pic&access_token=${facebookAccessToken}`;
            // TODO - update to request module
            https.get(url, (req, res) => {
                let body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    const facebookProfileObject = JSON.parse(body);
                    userProfileObject.firstName = facebookProfileObject.first_name;
                    userProfileObject.firstNameWithSpace = `${userProfileObject.firstName} `;
                    userProfileObject.lastName = facebookProfileObject.last_name;
                    userProfileObject.profilePic = facebookProfileObject.profile_pic;
                    resolve();
                });
            });
        }

        else if (dialogflowIncomingObject.originalRequest && dialogflowIncomingObject.originalRequest.source === 'google') {
            if (dialogflowIncomingObject.originalRequest.data.user && dialogflowIncomingObject.originalRequest.data.user.accessToken) {
                const googleAccessToken = dialogflowIncomingObject.originalRequest.data.user.accessToken;
                const url = `https://www.googleapis.com/plus/v1/people/me?access_token=${googleAccessToken}`;
                // TODO - update to request module
                https.get(url, (req, res) => {
                    let body = '';
                    req.on('data', function (data) {
                        body += data;
                    });
                    req.on('end', function() {
                        const googleProfileObject = JSON.parse(body);
                        userProfileObject.firstName = googleProfileObject.name.givenName;
                        userProfileObject.firstNameWithSpace = `${userProfileObject.firstName} `;
                        userProfileObject.lastName = googleProfileObject.name.familyName;
                        let profilePicUrl = googleProfileObject.image.url.split('photo.jpg')[0];
                        profilePicUrl = profilePicUrl + '/photo.jpg';
                        userProfileObject.profilePic = profilePicUrl;
                        resolve();
                    });
                });
            } else {
                resolve();
            }
        }

        else {
            resolve();
        }

    });

}

export function getUserProfileObject() {
    logJsonToFile('user-profile-object-log', userProfileObject);
    return userProfileObject;
}