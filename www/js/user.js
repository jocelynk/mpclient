angular.module('starter.factories', [])

.factory('UserFactory', function() {
    var userObject = {};
    userObject.name = '';
    userObject.phonenumber = '';
    userObject.isAuthenticated = false;
    userObject.latitude = null;
    userObject.longitude = null;

    return userObject;
  });
