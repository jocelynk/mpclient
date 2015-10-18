angular.module('starter.controllers', ['ngCordova', 'ngMap', 'starter.factories', 'starter.services'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPlatform) {

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
  .controller('LoginCtrl', ['$scope', '$state', '$ionicLoading', 'UserFactory', 'AuthService', 'LocationService', function ($scope, $state, $ionicLoading, UserFactory, AuthService, LocationService) {

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading your current location and meetings locations..'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };
    AuthService.login($scope.show).then(function (credentials) {
      if (angular.isDefined(credentials) && credentials != null) {
        UserFactory.currentUser.id = credentials.id;
        UserFactory.currentUser.name = credentials.name;
        UserFactory.currentUser.phoneNumber = credentials.phoneNumber;
        UserFactory.currentUser.isAuthenticated = credentials.isAuthenticated;
        UserFactory.currentUser.meetingLocations = credentials.meetingLocations;

        if (window.cordova) {
          LocationService.getCordovaCurrentLocation();
        } else {
          LocationService.getWebCurrentLocation();
        }

        $scope.hide();
        LocationService.getLocation();
        //$state.go('app.maps');
      } else {
        //handle not being able to login
      }

    });
  }])
  .controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicPlatform', '$ionicModal', 'UserFactory', 'MapService', 'LocationService', 'MeetingLocationService', 'ContactsService',
    function($scope, $state, $cordovaGeolocation, $ionicPlatform, $ionicModal, UserFactory, MapService, LocationService, MeetingLocationService, ContactsService) {

      $scope.infoWindow = null;
      $scope.refreshTimeout = null;
      $scope.refreshLocationTimeout = null;


      $ionicPlatform.ready(function () {
        if (!navigator.geolocation) {
          $ionicPopup.alert({
            title: 'Location Services Disabled',
            content: 'Please enable location services.'
          }).then(function (res) {
            console.log('Location Services was not enabled: ' + res);
          });
        } else {

          $scope.$on('mapInitialized', function (event, map) {
            MapService.map = map;
            MapService.infoWindow = MapService.initializeInfoWindow();
            google.maps.event.trigger(MapService.map, "resize");
            var myLatLng = new google.maps.LatLng(UserFactory.currentUser.coordinates.latitude, UserFactory.currentUser.coordinates.longitude);
            map.setCenter(myLatLng);
            MapService.initializeMapEvents();
            for(var i = 0; i < UserFactory.currentUser.meetingLocations.length; i++) {
              MapService.createMarker(UserFactory.currentUser.meetingLocations[i], null, $scope.openMeetingForm);
            }


          });

          // Refresh the markers every 2 seconds
          clearTimeout($scope.refreshLocationTimeout);
          $scope.refreshLocationTimeout = setTimeout(function () {
            var position = {};
            position.coords = {
              latitude: UserFactory.currentUser.coordinates.latitude,
              longitude: UserFactory.currentUser.coordinates.longitude
            };
            LocationService.geo_success(position);
          }, 1000 * 2);

          setInterval(function () {
            var position = {};
            position.coords = {
              latitude: UserFactory.currentUser.coordinates.latitude,
              longitude: UserFactory.currentUser.coordinates.longitude
            };
            LocationService.geo_success(position);
          }, 2000);
        }
      });

      $scope.placeMarker = function (e) {
        console.log(e);
        if (MapService.longPress) {
          MeetingLocationService.marker = new google.maps.Marker({
            position: e.latLng,
            map: MapService.map,
            draggable: true
          });
          var infowindow = new google.maps.InfoWindow();
          MeetingLocationService.marker.infoWindow = infowindow;
          MapService.map.panTo(e.latLng);

          $scope.openMeetingForm({});
        }
      };

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/meetingLocationForm.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });
      // Triggered in the login modal to close it
      $scope.closeMeetingForm = function () {
        $scope.modal.hide();
      };

      // Open the meeting form modal
      $scope.openMeetingForm = function (meetingLocation, marker) {
        // Form data for the meeting location modal
        $scope.meetingLocation = {};
        $scope.meetingLocation.name = meetingLocation.name || "";
        $scope.meetingLocation.description = meetingLocation.description || "";
        $scope.meetingLocation.private = meetingLocation.private || false;
        $scope.meetingLocation.date = meetingLocation.date || null;
        $scope.meetingLocation.phoneNumber = UserFactory.currentUser.phoneNumber;
        $scope.meetingLocation.attendees = meetingLocation.attendees || [];
        $scope.meetingLocation._id = meetingLocation._id || null;

        if(marker) {
          MeetingLocationService.marker = marker;
        }
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.saveMeetingLocation = function () {
        $scope.meetingLocation.latitude = MeetingLocationService.marker.getPosition().lat();
        $scope.meetingLocation.longitude = MeetingLocationService.marker.getPosition().lng();

        MeetingLocationService.saveMeetingLocation($scope.meetingLocation).then(function (location) {
          if (angular.isDefined(location.data) && location.data != null) {
            $scope.closeMeetingForm();

            google.maps.event.addListener(MeetingLocationService.marker, 'click', function (){
              MeetingLocationService.marker.infoWindow.setContent(location.data.description);
              MeetingLocationService.marker.infoWindow.open(MapService.map, this);
              event.preventDefault();
            });
            google.maps.event.addListener(MeetingLocationService.marker, 'dblclick', function (){
              MeetingLocationService.marker.infoWindow.close();
              $scope.openMeetingForm(location.data, MeetingLocationService.marker);
              event.preventDefault();
            });

            MeetingLocationService.marker.setPosition(new google.maps.LatLng(location.data.latitude, location.data.longitude));
          }
        }, function (err) {
          console.log(err);
          return null;
        });
      };

      //to store the contacts that the user invites
      $scope.contactData = {
        selectedContacts : []
      };

      $scope.pickContact = function() {

        ContactsService.pickContact().then(
          function(contact) {
            $scope.contactData.selectedContacts.push(contact);
            console.log("Selected contacts=");
            console.log($scope.data.selectedContacts);

          },
          function(failure) {
            console.log("Failed to pick a contact");
          }
        );

      }

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
