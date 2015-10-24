angular.module('starter.factories')

.factory('UserFactory', function() {
    var userObject = {};
    userObject.id = null;
    userObject.name = '';
    userObject.phoneNumber = '';
    userObject.isAuthenticated = false;
    userObject.coordinates = null;
    userObject.meetingLocations = [];
    userObject.timestamp = 0;
    userObject.randomIcon = Math.ceil(Math.random() * 5);
    userObject.marker = null;

    var users = {};

    return {
      currentUser: userObject,
      users: users
    };
  });
