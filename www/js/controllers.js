angular.module('starter.controllers', [ 'ngCordova'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })
  .controller('MapCtrl', ['$scope', '$cordovaGeolocation', '$ionicPlatform', function ($scope, $cordovaGeolocation, $ionicPlatform) {
    var iconBase = './img/';
    $scope.icons = {
      1: {
        icon: iconBase + 'pikachu.png'
      },
      2: {
        icon: iconBase + 'charizard.png'
      },
      3: {
        icon: iconBase + 'blastoise.png'
      },
      4: {
        icon: iconBase + 'venusaur.png'
      },
      5: {
        icon: iconBase + 'snorlax.png'
      }
    };
    // User Infomation
    $scope.currentUserInfo = null;
    $scope.users = {};
    // Google Maps UI
    $scope.map = null;
    $scope.infowindow = null;
    $scope.refreshTimeout = null;
    $scope.refreshLocationTimeout = null;

    $scope.initLocationSharing = function(location_callback) {
      var randomGuid = guid();
      $scope.userInfo = {
        id: randomGuid, // Something like.. 5dccc6c8-717d-49928b84
        name: randomGuid,
        randomIcon: Math.ceil(Math.random()*5)
      };

      // ================================
      // Setup Socket IO
      // ================================
      $scope.socket = io.connect('http://localhost:8888');

      $scope.socket.on('connect', function () {
        $scope.socket.on('get_location', function (location) {
          console.log("emitting location");
          //#if (!(location.id in $scope.users)) {
          //console.log("userLocationUpdate")
          location_callback(location);
          //}
        })
      });

      // ================================
      // Setup Geolocation
      // ================================
      if (!navigator.geolocation) {
        return $scope.userInfo;
      }

      $scope.geo_success = function (position, coordinates) {
        console.log("geosuccess");
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        if(coordinates) {
          $scope.userInfo.latitude = coordinates.latitude + (plusOrMinus * (Math.random() *.01));
          $scope.userInfo.longitude = coordinates.longitude + (plusOrMinus * (Math.random() *.01));
        } else {
          $scope.userInfo.latitude = position.coords.latitude + (plusOrMinus * (Math.random() *.01));
          $scope.userInfo.longitude = position.coords.longitude + (plusOrMinus * (Math.random() *.01));
        }
        location_callback($scope.userInfo);
        $scope.sendLocation();
      };

      $scope.geo_success_cordova = function (position) {
        console.log("geosuccess");
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        if(position) {
          $scope.userInfo.latitude = position.coords.latitude + (plusOrMinus * (Math.random() * .01));
          $scope.userInfo.longitude = position.coords.longitude + (plusOrMinus * (Math.random() * .01));
        }
        location_callback($scope.userInfo);
        $scope.sendLocation();
      };

      $scope.geo_error = function () {
        //error_callback();
      };

      $scope.sendLocationTimeout = null;
      $scope.sendLocation = function () {
        $scope.socket.emit('send_location', $scope.userInfo);
        clearTimeout($scope.sendLocationTimeout);
        $scope.sendLocationTimeout = setTimeout($scope.sendLocation, 1000 * 5);
      };

      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions).then($scope.geo_success_cordova, $scope.geo_error);

      var watchOptions = {
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watch = $cordovaGeolocation.watchPosition(watchOptions);
      watch.then(
        null,
        function(err) {
          // error
        },
        $scope.geo_success_cordova);

      $cordovaGeolocation.clearWatch(watch)

      // Refresh the markers every 2 seconds
      clearTimeout($scope.refreshLocationTimeout)
      $scope.refreshLocationTimeout = setTimeout(function() {
        coordinates = {latitude: $scope.userInfo.latitude, longitude:  $scope.userInfo.longitude}
        $scope.geo_success(null, coordinates);
      }, 1000 * 2);

      setInterval(function() {
        coordinates = {latitude: $scope.userInfo.latitude, longitude:  $scope.userInfo.longitude}
        $scope.geo_success(null, coordinates);
      }, 2000);


      return $scope.userInfo;
    };

    $scope.userLocationUpdate = function (userInfo) {
      console.log("updating location")
      if (!$scope.users[userInfo.id]) $scope.users[userInfo.id] = {id: userInfo.id};
      console.log(userInfo);
      $scope.users[userInfo.id].name = userInfo.name;
      $scope.users[userInfo.id].latitude = userInfo.latitude;
      $scope.users[userInfo.id].longitude = userInfo.longitude;
      $scope.users[userInfo.id].timestamp = new Date().getTime();
      $scope.users[userInfo.id].randomIcon = userInfo.randomIcon;
      console.log(userInfo.name);
      console.log(userInfo.latitude);
      console.log(userInfo.longitude);
      console.log(userInfo.timestamp);
      $scope.refreshMarkers();
    };

    $scope.refreshMarkers = function () {
      if (!$scope.map) return;
      console.log("refreshing markers");
      if (!$scope.currentUserInfo.movedMapCenter && $scope.currentUserInfo.timestamp) {
        /* $('#user-name').val(currentUserInfo.name);
         $('#user-name').bind('keyup', function() {
         currentUserInfo.name = $('#user-name').val();
         })*/
        $scope.currentUserInfo.movedMapCenter = true;
        $scope.map.setCenter(new google.maps.LatLng(
          $scope.currentUserInfo.latitude, $scope.currentUserInfo.longitude));
      }
      for (var id in $scope.users) {
        var userInfo = $scope.users[id];
        /*        if(userInfo.id == $scope.currentUserInfo.id)
         $scope.currentUserInfo = userInfo.id;*/
        if (userInfo.marker) {

          // If we havn't received any update from the user
          //  We remove the marker of missing user
          if (userInfo.id != $scope.currentUserInfo.id &&
            userInfo.timestamp + 1000 * 30 < new Date().getTime()) {
            userInfo.marker.setMap(null);
            delete $scope.users[id];
            continue;
          }
        } else {
          // Create a marker for the new user
          console.log("getting icon");
          console.log(userInfo);
          console.log($scope.icons[userInfo.randomIcon]);
          var marker = new google.maps.Marker({map: $scope.map, icon: $scope.icons[userInfo.randomIcon]['icon']});
          google.maps.event.addListener(marker, 'click', function () {
            $scope.infowindow.setContent(marker.getTitle())
            $scope.infowindow.open($scope.map, marker);
          });
          userInfo.marker = marker;
        }
        //Move the markers
        console.log("moving the marker");
        userInfo.marker.setTitle(userInfo.name);
        userInfo.marker.setPosition(
          new google.maps.LatLng(userInfo.latitude, userInfo.longitude));
      }

      /* $('#user-number').text(Math.max(Object.keys(users).length-1,0) +'')*/
      // Refresh the markers every 2 seconds
      clearTimeout($scope.refreshTimeout)
      $scope.refreshTimeout = setTimeout($scope.refreshMarkers, 1000 * 2);
    };

    $scope.mapInitialize = function () {
      console.log("initilizing map");
      $scope.map = new google.maps.Map(angular.element(document.querySelector('#map'))[0], {
        zoom: 8,
        center: new google.maps.LatLng(40, -74),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      $scope.infowindow = new google.maps.InfoWindow({content: 'Test'});
      google.maps.event.addListener(map, 'click', function () {
        infowindow.close(map);
      });
      $scope.refreshMarkers();
    };

    $ionicPlatform.ready(function() {
      $scope.currentUserInfo = $scope.initLocationSharing($scope.userLocationUpdate);

      $scope.mapInitialize();
    });
  }]);

// delete inactive users every 15 sec
/*    setInterval(function() {
 for (var ident in connects){
 if ($.now() - connects[ident].updated > 15000) {
 delete connects[ident];
 map.removeLayer(markers[ident]);
 }
 }
 }, 15000);
 */


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + s4();
}
