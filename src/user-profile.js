const https = require('https');
const fs = require('fs');
import logJsonToFile from './utils/log-json-to-file';

let userProfile = {
    firstName: '',
    lastName: '',
    profilePic: ''
};

export function setUserProfile(originalIncomingObjectFromDialogflow, config) {

    return new Promise((resolve, reject) => {

        if (originalIncomingObjectFromDialogflow.originalRequest && originalIncomingObjectFromDialogflow.originalRequest.source === 'facebook') {

            const facebookAccessToken = config.facebookAccessToken;
            const facebookUserId = originalIncomingObjectFromDialogflow.originalRequest.data.sender.id;
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

        else if (originalIncomingObjectFromDialogflow.originalRequest && originalIncomingObjectFromDialogflow.originalRequest.source === 'google') {
            if (originalIncomingObjectFromDialogflow.originalRequest.data.user && originalIncomingObjectFromDialogflow.originalRequest.data.user.accessToken) {
                const googleAccessToken = originalIncomingObjectFromDialogflow.originalRequest.data.user.accessToken;
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
    logJsonToFile('user-profile-log', userProfile);
    return userProfile;
}