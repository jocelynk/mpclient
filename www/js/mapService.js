angular.module('starter.factories')

  .factory('MapService', ['$timeout', '$cordovaGeolocation', 'UserFactory', function($timeout, $cordovaGeolocation, UserFactory) {

    var MapService = {};

    MapService.map = null;
    MapService.infoWindow = null;
    MapService.longPress = false;
    MapService.startMouseDown = null;

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
        zoom: 15,
        center: new google.maps.LatLng(longitude, latitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      return map;
    };

    MapService.initializeInfoWindow = function(description) {
      var window = new google.maps.InfoWindow({content: description});

      return window;
    };

    MapService.initializeEvents = function() {
      /*google.maps.event.addListener(marker,'click', function (event) {
        (longpress) ? console.log("Long Press") : console.log("Short Press");
      });
    */
/*      MapService.map.addListener(marker,'click', function (event) {
        (MapService.longPress) ? console.log("Long Press") : console.log("Short Press");
      });*/

      MapService.map.addListener('mousedown', function(event){
        MapService.startMouseDown = new Date().getTime();
      });

      MapService.map.addListener('mouseup', function(event){

        var end = new Date().getTime();
        MapService.longPress = (end - MapService.startMouseDown < 500) ? false : true;

      });
    };

    MapService.createMarker = function(title, description) {
      var marker = new google.maps.Marker({map: MapService.map, icon: MapService.icons[userInfo.randomIcon]['icon']});
      google.maps.event.addListener(marker, 'click', function () {
        if(angular.isDefined(title) && title !== null && title.length !== 0) {
          MapService.infoWindow.setTitle(title);
        }

        if(angular.isDefined(description) && description !== null && description.length !== 0) {
          MapService.infoWindow.setContent(description);
        }

        MapService.infoWindow.open(MapService.map, this);
      });
    };


   MapService.refreshMarkers = function () {
      if (!MapService.map) return;
      if (!UserFactory.currentUser.movedMapCenter && UserFactory.currentUser.timestamp) {
        UserFactory.currentUser.movedMapCenter = true;
        MapService.map.setCenter(new google.maps.LatLng(
          UserFactory.currentUser.coordinates.latitude, UserFactory.currentUser.coordinates.longitude));
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
            MapService.infoWindow.open(MapService.map, this);
          });
          userInfo.marker = marker;
        }
        //Move the markers
        userInfo.marker.setTitle(userInfo.name);
        userInfo.marker.setPosition(
          new google.maps.LatLng(userInfo.coordinates.latitude, userInfo.coordinates.longitude));
      }

      // Refresh the markers every 2 seconds
      //clearTimeout($scope.refreshTimeout);
      //$scope.refreshTimeout = setTimeout($scope.refreshMarkers, 1000 * 2);

      var timer = $timeout(function(){
        MapService.refreshMarkers();
        $timeout.cancel(timer);
      }, 2000);
    };

    return MapService;

  }]);
