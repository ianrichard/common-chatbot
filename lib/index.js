'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUserProfile = exports.getUserProfile = exports.getResponseObjectForDialogflow = undefined;

var _responseAggregate = require('./response-aggregate');

var _responseAggregate2 = _interopRequireDefault(_responseAggregate);

var _userProfile = require('./user-profile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getResponseObjectForDialogflow = _responseAggregate2.default;
exports.getUserProfile = _userProfile.getUserProfile;
exports.setUserProfile = _userProfile.setUserProfile;