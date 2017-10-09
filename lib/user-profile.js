'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setUserProfile = setUserProfile;
exports.getUserProfile = getUserProfile;

var _logJsonToFile = require('./utils/log-json-to-file');

var _logJsonToFile2 = _interopRequireDefault(_logJsonToFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var https = require('https');
var fs = require('fs');


var userProfile = {
    firstName: '',
    lastName: '',
    profilePic: ''
};

function setUserProfile(originalIncomingObjectFromApiAi, config) {

    return new Promise(function (resolve, reject) {

        if (originalIncomingObjectFromApiAi.originalRequest && originalIncomingObjectFromApiAi.originalRequest.source === 'facebook') {

            var facebookAccessToken = config.facebookAccessToken;
            var facebookUserId = originalIncomingObjectFromApiAi.originalRequest.data.sender.id;
            var url = 'https://graph.facebook.com/v2.6/' + facebookUserId + '?fields=first_name,last_name,profile_pic&access_token=' + facebookAccessToken;
            https.get(url, function (req, res) {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    var facebookProfileData = JSON.parse(body);
                    userProfile.firstName = facebookProfileData.first_name;
                    userProfile.firstNameWithSpace = userProfile.firstName + ' ';
                    userProfile.lastName = facebookProfileData.last_name;
                    userProfile.profilePic = facebookProfileData.profile_pic;
                    resolve();
                });
            });
        } else if (originalIncomingObjectFromApiAi.originalRequest && originalIncomingObjectFromApiAi.originalRequest.source === 'google') {
            if (originalIncomingObjectFromApiAi.originalRequest.data.user && originalIncomingObjectFromApiAi.originalRequest.data.user.accessToken) {
                var googleAccessToken = originalIncomingObjectFromApiAi.originalRequest.data.user.accessToken;
                var _url = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + googleAccessToken;
                https.get(_url, function (req, res) {
                    var body = '';
                    req.on('data', function (data) {
                        body += data;
                    });
                    req.on('end', function () {
                        var googleProfileData = JSON.parse(body);
                        userProfile.firstName = googleProfileData.name.givenName;
                        userProfile.firstNameWithSpace = userProfile.firstName + ' ';
                        userProfile.lastName = googleProfileData.name.familyName;
                        var profilePicUrl = googleProfileData.image.url.split('photo.jpg')[0];
                        profilePicUrl = profilePicUrl + '/photo.jpg';
                        userProfile.profilePic = profilePicUrl;
                        resolve();
                    });
                });
            } else {
                resolve();
            }
        } else {
            resolve();
        }
    });
}

function getUserProfile() {
    (0, _logJsonToFile2.default)('user-profile-log', userProfile);
    return userProfile;
}