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
      },
      default: {
        icon: iconBase + 'default_icon.png'
      }
    };

    MapService.initializeMap = function (longitude, latitude) {
     /* var map = new google.maps.Map(angular.element(document.querySelector('#map'))[0], {
        zoom: 15,
        center: new google.maps.LatLng(longitude, latitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });*/

      // Initialize the map plugin
      var map = plugin.google.maps.Map.getMap(angular.element(document.querySelector('#map'))[0]);
      map.setClickable(false);
      return map;
    };

    MapService.initializeInfoWindow = function(description) {
      var window = new google.maps.InfoWindow({content: description});

      return window;
    };

    MapService.initializeMapEvents = function() {
      MapService.map.addListener('mousedown', function(event){
        MapService.startMouseDown = new Date().getTime();
      });

      MapService.map.addListener('mouseup', function(event){

        var end = new Date().getTime();
        MapService.longPress = (end - MapService.startMouseDown < 300) ? false : true;

      });
    };

    MapService.createMarker = function(meetingLocation, icon, callback) {
      var myLatLng = new plugin.google.maps.LatLng(meetingLocation.latitude, meetingLocation.longitude);

      MapService.map.addMarker({
        'position': myLatLng,
        'title': meetingLocation.name,
        'icon': {
          'url': angular.isDefined(icon) && icon !== null? icon : MapService.icons['default']['icon']
        },
        draggable: true,
        'markerClick': function(marker) {
          callback(meetingLocation, marker);
          event.preventDefault();
        }
      }, function (marker) {
      });

      /*      var marker = new google.maps.Marker({map: MapService.map, icon: angular.isDefined(icon) && icon !== null? icon : MapService.icons['default']['icon'], draggable: true});
            var infoWindow = new google.maps.InfoWindow({content: meetingLocation.description});
            marker.infoWindow = infoWindow;

              google.maps.event.addListener(marker, 'click', function (){

                marker.infoWindow.setContent(meetingLocation.description);
                marker.infoWindow.open(MapService.map, this);
                event.preventDefault();
              });

              google.maps.event.addListener(marker, 'dblclick', function (){
                marker.infoWindow.close();
                callback(meetingLocation, marker);
                event.preventDefault();
              });

              marker.setPosition(new google.maps.LatLng(meetingLocation.latitude, meetingLocation.longitude));*/
    };


   MapService.refreshMarkers = function () {
      if (!MapService.map) return;
      /*if (!UserFactory.currentUser.movedMapCenter && UserFactory.currentUser.timestamp) {
        UserFactory.currentUser.movedMapCenter = true;
        MapService.map.setCenter(new google.maps.LatLng(
          UserFactory.currentUser.coordinates.latitude, UserFactory.currentUser.coordinates.longitude));
      }
*/
      for (var id in UserFactory.users) {
        var userInfo = UserFactory.users[id];
        if (userInfo.marker) {
          // If we havn't received any update from the user
          //  We remove the marker of missing user
          if (userInfo.id != UserFactory.currentUser.id &&
            userInfo.timestamp + 1000 * 30 < new Date().getTime()) {
            //userInfo.marker.setMap(null);
            userInfo.marker.remove();
            delete UserFactory.users[id];
            continue;
          } else {
            userInfo.marker.setTitle(userInfo.name);
            userInfo.marker.setPosition(
               new plugin.google.maps.LatLng(userInfo.coordinates.latitude, userInfo.coordinates.longitude));
          }


        } else {
          // Create a marker for the new user

          var myLatLng = new plugin.google.maps.LatLng(userInfo.coordinates.latitude, userInfo.coordinates.longitude);

          MapService.map.addMarker({
            'position': myLatLng,
            'title': userInfo.name,
            'icon': {
              'url': MapService.icons[userInfo.randomIcon]['icon']
            },
            draggable: true,
            'markerClick': function(marker) {
              marker.showInfoWindow();
              event.preventDefault();
            }
          }, function (marker) {
            userInfo.marker = marker;
          });

         /* var marker = new google.maps.Marker({map: MapService.map, icon: MapService.icons[userInfo.randomIcon]['icon']});
          google.maps.event.addListener(marker, 'click', function () {
            MapService.infoWindow.setContent(marker.getTitle());
            MapService.infoWindow.open(MapService.map, this);
          });
          userInfo.marker = marker;*/
        }
        //Move the markers
      /*  userInfo.marker.setTitle(userInfo.name);
        userInfo.marker.setPosition(
          new google.maps.LatLng(userInfo.coordinates.latitude, userInfo.coordinates.longitude));*/
      }

      // Refresh the markers every 2 seconds
      //clearTimeout($scope.refreshTimeout);
      //$scope.refreshTimeout = setTimeout($scope.refreshMarkers, 1000 * 2);

      var timer = $timeout(function(){
        MapService.refreshMarkers();
        $timeout.cancel(timer);
      }, 5000);
    };

    return MapService;

  }]);
