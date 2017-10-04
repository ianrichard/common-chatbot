const https = require('https');
const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';

let userProfile = {
    firstName: '',
    lastName: '',
    profilePic: ''
};

export function setUserProfile(originalIncomingObjectFromApiAi, config) {

    return new Promise((resolve, reject) => {

        if (originalIncomingObjectFromApiAi.originalRequest && originalIncomingObjectFromApiAi.originalRequest.source === 'facebook') {

            const facebookAccessToken = config.facebookAccessToken;
            const facebookUserId = originalIncomingObjectFromApiAi.originalRequest.data.sender.id;
            const url = `https://graph.facebook.com/v2.6/${facebookUserId}?fields=first_name,last_name,profile_pic&access_token=${facebookAccessToken}`;
            https.get(url, (req, res) => {
                let body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    const facebookProfileData = JSON.parse(body);
                    userProfile.firstName = facebookProfileData.first_name;
                    userProfile.firstNameWithSpace = `${userProfile.firstName} `;
                    userProfile.lastName = facebookProfileData.last_name;
                    userProfile.profilePic = facebookProfileData.profile_pic;
                    resolve();
                });
            });
        }

        else if (originalIncomingObjectFromApiAi.originalRequest && originalIncomingObjectFromApiAi.originalRequest.source === 'google') {
            if (originalIncomingObjectFromApiAi.originalRequest.data.user && originalIncomingObjectFromApiAi.originalRequest.data.user.accessToken) {
                const googleAccessToken = originalIncomingObjectFromApiAi.originalRequest.data.user.accessToken;
                const url = `https://www.googleapis.com/plus/v1/people/me?access_token=${googleAccessToken}`;
                https.get(url, (req, res) => {
                    let body = '';
                    req.on('data', function (data) {
                        body += data;
                    });
                    req.on('end', function() {
                        const googleProfileData = JSON.parse(body);
                        userProfile.firstName = googleProfileData.name.givenName;
                        userProfile.firstNameWithSpace = `${userProfile.firstName} `;
                        userProfile.lastName = googleProfileData.name.familyName;
                        let profilePicUrl = googleProfileData.image.url.split('photo.jpg')[0];
                        profilePicUrl = profilePicUrl + '/photo.jpg';
                        userProfile.profilePic = profilePicUrl;
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

export function getUserProfile() {
    logJsonToFile('user-profile', userProfile);
    return userProfile;
}