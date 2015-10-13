angular.module('starter.services', ['ngCordova'])

  .factory('LocationService', ['$timeout', '$cordovaGeolocation', 'UserFactory', function($timeout, $cordovaGeolocation, UserFactory) {
    var LocationService = {};

    //LocationService.sendLocationTimeout = null;
    var socket = io.connect('localhost:8888');


    LocationService.connectSockets = function(location_callback) {
      socket.on('connect', function () {
        socket.on('get_location', function (location) {
          if(location_callback)
            location_callback(location);
        })
      });

    };


    LocationService.sendLocation = function () {
      socket.emit('send_location', UserFactory.currentUser);

      //alternate way of canceling out timer?
      var timer = $timeout(function(){
        LocationService.sendLocation();
        console.log(timer.$$timeoutId);
        $timeout.cancel(timer);
      }, 1000);

      //clearTimeout(LocationService.sendLocationTimeout);
      //LocationService.sendLocationTimeout = setTimeout(LocationService.sendLocation, 1000 * 5);
    };

    /*Service method that will send location data to sockets on server for each user
    In the future, needs to be tagged so will know whether or not to show the user on the map
    */
    LocationService.userLocationUpdate = function (userInfo, refresh) {
      if (UserFactory.users[userInfo.id]) UserFactory.users[userInfo.id] = {id: userInfo.id};
      //console.log(userInfo);
      UserFactory.users[userInfo.id].name = userInfo.name;
      UserFactory.users[userInfo.id].latitude = userInfo.latitude;
      UserFactory.users[userInfo.id].longitude = userInfo.longitude;
      UserFactory.users[userInfo.id].timestamp = new Date().getTime();
      UserFactory.users[userInfo.id].randomIcon = userInfo.randomIcon;

      if(refresh) refresh();
    };

    LocationService.geo_success_cordova = function (position, location_callback) {
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      if (position) {
        UserFactory.currentUser.latitude = position.coords.latitude + (plusOrMinus * (Math.random() * .01));
        UserFactory.currentUser.longitude = position.coords.longitude + (plusOrMinus * (Math.random() * .01));
      }
      location_callback(UserFactory.currentUser);
      LocationService.sendLocation();
    };

    LocationService.geo_error = function () {
      //error_callback();
    };

    LocationService.getCurrentLocation = function() {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(LocationService.geo_success_cordova, LocationService.geo_error);
    };


    return LocationService;

  }]);
