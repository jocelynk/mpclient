angular.module('starter.factories')

  .factory('LocationService', ['$timeout', '$q', '$cordovaGeolocation', 'UserFactory', 'MapService', function($timeout, $q, $cordovaGeolocation, UserFactory, MapService) {
    var LocationService = {};

    var socket = io.connect('http://mp-server.herokuapp.com');
    LocationService.getLocation = function() {

      socket.on('get_location', function (userInfo) {
        LocationService.userLocationUpdate(userInfo);
      });
    };

    var deferred = $q.defer();



    LocationService.sendLocation = function () {
      var socketObj = {coordinates: {}};

      //need to populate with other stuff to send to sockets later
      socketObj.id = UserFactory.currentUser.id;
      if(angular.isDefined(UserFactory.currentUser.coordinates) && UserFactory.currentUser.coordinates !== null) {
        socketObj.coordinates.latitude = UserFactory.currentUser.coordinates.latitude;
        socketObj.coordinates.longitude = UserFactory.currentUser.coordinates.longitude;
        socketObj.randomIcon = UserFactory.currentUser.randomIcon;
        socketObj.name = UserFactory.currentUser.name;

        socket.emit('send_location', socketObj);
      }

      //alternate way of canceling out timer?
      var timer = $timeout(function(){
        LocationService.sendLocation();
        $timeout.cancel(timer);
      }, 5000);

      //clearTimeout(LocationService.sendLocationTimeout);
      //LocationService.sendLocationTimeout = setTimeout(LocationService.sendLocation, 1000 * 5);
    };

    /*Service method that will send location data to sockets on server for each user
    In the future, needs to be tagged so will know whether or not to show the user on the map
    */
    LocationService.userLocationUpdate = function (userInfo) {
      if (!UserFactory.users[userInfo.id]) UserFactory.users[userInfo.id] = userInfo;

      var originalLat = UserFactory.users[userInfo.id].coordinates.latitude;
      var originalLong = UserFactory.users[userInfo.id].coordinates.longitude
      if(Math.abs(originalLat - userInfo.coordinates.latitude) > 0.0001 || Math.abs(originalLong - userInfo.coordinates.longitude) > 0.0001) {
        UserFactory.currentUser.movedMapCenter = false;
      }

      //UserFactory.users[userInfo.id].name = userInfo.name;
      UserFactory.users[userInfo.id].coordinates.latitude = userInfo.coordinates.latitude;
      UserFactory.users[userInfo.id].coordinates.longitude = userInfo.coordinates.longitude;
      UserFactory.users[userInfo.id].timestamp = new Date().getTime();
     // UserFactory.users[userInfo.id].randomIcon = userInfo.randomIcon;


      MapService.refreshMarkers();
    };

    LocationService.geo_success = function (position) {
      //console.log("geo_success");
      //console.log(position);
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      if (position) {
        //temporarily making user move randomly
        if(!angular.isDefined(UserFactory.currentUser.coordinates) || UserFactory.currentUser.coordinates === null) {
          UserFactory.currentUser.coordinates = {};
        }

        UserFactory.currentUser.coordinates.latitude = position.coords.latitude + (plusOrMinus * (Math.random() * .0001));
        UserFactory.currentUser.coordinates.longitude = position.coords.longitude + (plusOrMinus * (Math.random() * .0001));
      }
      LocationService.userLocationUpdate(UserFactory.currentUser);
      LocationService.sendLocation();
      deferred.resolve(position);
    };

    LocationService.geo_success_watch = function (position) {
      //console.log("geo_success watch");
      //console.log(position);
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      if (position) {
        //temporarily making user move randomly
        if(!angular.isDefined(UserFactory.currentUser.coordinates) || UserFactory.currentUser.coordinates === null) {
          UserFactory.currentUser.coordinates = {};
        }

        UserFactory.currentUser.coordinates.latitude = position.coords.latitude;// + (plusOrMinus * (Math.random() * .0001));
        UserFactory.currentUser.coordinates.longitude = position.coords.longitude;// + (plusOrMinus * (Math.random() * .0001));
      }
      LocationService.userLocationUpdate(UserFactory.currentUser);
      LocationService.sendLocation();
      deferred.resolve(position);
    };

    LocationService.geo_error = function () {
      //error_callback();
      console.log("Error: no update received");
      deferred.reject("Error: no update received");
    };

    LocationService.getCordovaCurrentLocation = function() {
      var posOptions = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(LocationService.geo_success, LocationService.geo_error);
      return deferred.promise;
    };

    LocationService.getWebCurrentLocation = function() {
      navigator.geolocation.getCurrentPosition(LocationService.geo_success, LocationService.geo_error);

      return deferred.promise;
    };

    LocationService.getWatchPosition = function() {
      var posOptions = {timeout: 1000, enableHighAccuracy: true};
      navigator.geolocation.watchPosition(LocationService.geo_success, LocationService.geo_error, posOptions);
      return deferred.promise;
    };

    return LocationService;

  }]);
