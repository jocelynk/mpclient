angular.module('starter.factories', [])

.factory('UserFactory', function() {
    var userObject = {};
    userObject.id = null;
    userObject.name = '';
    userObject.phoneNumber = '';
    userObject.isAuthenticated = false;
    userObject.latitude = null;
    userObject.longitude = null;
    userObject.meetingLocations = {};
    userObject.timestamp = 0;

    var users = {};

    return {
      currentUser: userObject,
      users: users
    };
  });
