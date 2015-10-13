angular.module('starter.services', ['ngCordova'])

  .factory('MapService', ['$timeout', '$cordovaGeolocation', 'UserFactory', function($timeout, $cordovaGeolocation, UserFactory) {

    var MapService = {};

    MapService.map = null;
    MapService.infoWindow = null;

    var iconBase = './img/';
    MapService.icons = {
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

    MapService.initializeMap = function (longitude, latitude) {
      var map = new google.maps.Map(angular.element(document.querySelector('#map'))[0], {
        zoom: 8,
        center: new google.maps.LatLng(longitude, latitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      return map;
    };

    MapService.initializeInfoWindow = function(description) {
      var window = new google.maps.InfoWindow({content: description});

      return window;
    };


   MapService.refreshMarkers = function () {
      if (!MapService.map) return;
      if (!UserFactory.currentUser.movedMapCenter && UserFactory.currentUser.timestamp) {
        UserFactory.currentUser.movedMapCenter = true;
        MapService.map.setCenter(new google.maps.LatLng(
          UserFactory.currentUserInfo.latitude, UserFactory.currentUserInfo.longitude));
      }

      for (var id in UserFactory.users) {
        var userInfo = UserFactory.users[id];
        if (userInfo.marker) {
          // If we havn't received any update from the user
          //  We remove the marker of missing user
          if (userInfo.id != UserFactory.currentUser.id &&
            userInfo.timestamp + 1000 * 30 < new Date().getTime()) {
            userInfo.marker.setMap(null);
            delete UserFactory.users[id];
            continue;
          }
        } else {
          // Create a marker for the new user
          var marker = new google.maps.Marker({map: MapService.map, icon: MapService.icons[userInfo.randomIcon]['icon']});
          google.maps.event.addListener(marker, 'click', function () {
            MapService.infoWindow.setContent(marker.getTitle());
            MapService.infoWindow.open(MapService.map, marker);
          });
          userInfo.marker = marker;
        }
        //Move the markers
        userInfo.marker.setTitle(userInfo.name);
        userInfo.marker.setPosition(
          new google.maps.LatLng(userInfo.latitude, userInfo.longitude));
      }

      // Refresh the markers every 2 seconds
      //clearTimeout($scope.refreshTimeout);
      //$scope.refreshTimeout = setTimeout($scope.refreshMarkers, 1000 * 2);

      var timer = $timeout(function(){
        MapService.refreshMarkers();
        console.log(timer.$$timeoutId);
        $timeout.cancel(timer);
      }, 1000);
    };

    return MapService;

  }]);
