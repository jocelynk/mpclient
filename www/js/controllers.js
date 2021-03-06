angular.module('starter.controllers', ['ngCordova', /*'ngMap',*/ 'starter.factories', 'starter.services'])

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
  .controller('LoginCtrl', ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicHistory', 'UserFactory', 'AuthService', 'LocationService', 'MapService', function ($scope, $state, $timeout, $ionicLoading, $ionicHistory, UserFactory, AuthService, LocationService, MapService) {

    $scope.show = function () {
      $ionicLoading.show({
        template: 'Loading your current location and meetings locations..'
      });
    };
    $scope.hide = function () {
      $ionicLoading.hide();
    };
    AuthService.login($scope.show).then(function (credentials) {
      if (angular.isDefined(credentials) && credentials != null) {
        UserFactory.currentUser.id = credentials.id;
        UserFactory.currentUser.name = credentials.name;
        UserFactory.currentUser.phoneNumber = credentials.phoneNumber;
        UserFactory.currentUser.isAuthenticated = credentials.isAuthenticated;
        UserFactory.currentUser.meetingLocations = credentials.meetingLocations || UserFactory.currentUser.meetingLocations;

        if (window.cordova) {
          LocationService.getCordovaCurrentLocation().then(function (position) {
            console.log(position);
            $timeout(function () {
              $scope.hide();
              LocationService.getLocation();
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('app.maps');
            }, 500);
          });
        } else {
          LocationService.getWebCurrentLocation().then(function (position) {

            $timeout(function () {
              $scope.hide();
              LocationService.getLocation();
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('app.maps');
            }, 500);


          });
        }
      } else {
        //handle not being able to login
      }

    });
  }])
  .controller('MapCtrl', ['$rootScope', '$scope', '$filter', '$cordovaToast', '$cordovaGeolocation', '$ionicPlatform', '$ionicModal', 'Constants', 'UserFactory', 'MapService', 'LocationService', 'MeetingLocationService', 'ContactsService',
    function ($rootScope, $scope, $filter, $cordovaToast, $cordovaGeolocation, $ionicPlatform, $ionicModal, Constants, UserFactory, MapService, LocationService, MeetingLocationService, ContactsService) {

      $scope.infoWindow = null;
      $scope.refreshTimeout = null;
      $scope.refreshLocationTimeout = null;
      $scope.geoLocation = {address: ''};
      $scope.searchTerm = {term: '', address: ''};
      $scope.meetingsList = UserFactory.currentUser.meetingLocations;

      $ionicPlatform.ready(function () {
        if (!navigator.geolocation) {
          $ionicPopup.alert({
            title: 'Location Services Disabled',
            content: 'Please enable location services.'
          }).then(function (res) {
            console.log('Location Services was not enabled: ' + res);
          });
        } else {

          if (window.cordova) {
            $rootScope.map = MapService.initializeMap();
            MapService.map = $rootScope.map;
            $rootScope.map.on(plugin.google.maps.event.MAP_READY, function (map) {
              map.setOptions({
                mapType: plugin.google.maps.MapTypeId.ROADMAP,
                controls: {
                  compass: true,
                  myLocationButton: true
                },
                gestures: {
                  scroll: true,
                  tilt: false,
                  rotate: false,
                  zoom: true
                }
              });
              map.setClickable(true);
              var myLatLng = new plugin.google.maps.LatLng(UserFactory.currentUser.coordinates.latitude, UserFactory.currentUser.coordinates.longitude);
              map.setCenter(myLatLng);
              map.setZoom(17);

              for (var i = 0; i < UserFactory.currentUser.meetingLocations.length; i++) {
                MapService.createMarker(UserFactory.currentUser.meetingLocations[i], null, $scope.openMeetingForm);
              }

              LocationService.getWatchPosition();

            });
          }


          /*$scope.$on('mapInitialized', function (event, map) {
           MapService.map = map;
           MapService.infoWindow = MapService.initializeInfoWindow();
           google.maps.event.trigger(MapService.map, "resize");
           var myLatLng = new google.maps.LatLng(UserFactory.currentUser.coordinates.latitude, UserFactory.currentUser.coordinates.longitude);
           map.setCenter(myLatLng);
           MapService.initializeMapEvents();
           for (var i = 0; i < UserFactory.currentUser.meetingLocations.length; i++) {
           MapService.createMarker(UserFactory.currentUser.meetingLocations[i], null, $scope.openMeetingForm);
           }

           LocationService.getWatchPosition();

           });*/

          /*// Refresh the markers every 2 seconds
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
           }, 2000);*/
        }
      });

      if (window.cordova) {
        var longClick = plugin.google.maps.event.MAP_LONG_CLICK;
        $rootScope.map.on(longClick, function (latLng) {
          $rootScope.map.addMarker({
            'position': latLng,
            'title': ''
          }, function (marker) {
            MeetingLocationService.marker = marker;
            marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
              $scope.openMeetingForm({}, marker);
            });
            $scope.openMeetingForm({}, marker);
          });
        });
      }


      $scope.placeMarker = function (e) {
        var longClick = plugin.google.maps.event.MAP_LONG_CLICK;
        $rootScope.map.on(longClick, function (latLng) {
          $rootScope.map.addMarker({
            'position': latLng,
            'title': ''
          }, function (marker) {
            MeetingLocationService.marker = marker;
            $scope.openMeetingForm({}, marker)
          });
        });
      };

      $scope.addressLookup = function () {
        MapService.addressLookup($scope.searchTerm.address, $scope.openMeetingForm);
        $scope.searchTerm.address = '';
      };

      $scope.pickContact = function () {
        ContactsService.pickContact().then(
          function (contact) {
            $scope.contacts.selectedContacts.push(contact);

          },
          function (failure) {
            console.log("Failed to pick a contact");
          }
        );

      };

      $scope.findContactsBySearchTerm = function () {
        if (angular.isDefined($scope.searchTerm.term) && $scope.searchTerm.term != null && $scope.searchTerm.term.length > 0) {
          ContactsService.searchContacts($scope.searchTerm.term).then(function (contacts) {
            $scope.contacts.selectedContacts = $scope.contacts.selectedContacts.concat(contacts);
          }, function (err) {
            console.log(err);
          })
        } else {
          $cordovaToast.showShortBottom('Please enter in a name or phone number').then(function (success) {
            // success
          }, function (error) {
            // error
          });
        }
      };

      $scope.deleteContact = function (contact, pendingList) {
        var index;
        if (pendingList) {
          index = $scope.contacts.selectedContacts.indexOf(contact);
          if (index == 0) {
            $scope.contacts.selectedContacts.shift();
          } else {
            $scope.contacts.selectedContacts = $scope.contacts.selectedContacts.splice(index);
          }

        } else {
          index = $scope.meetingLocation.attendees.indexOf(contact);
          if (index == 0) {
            $scope.meetingLocation.attendees.shift();
          } else {
            $scope.meetingLocation.attendees = $scope.meetingLocation.attendees.splice($scope.meetingLocation.attendees.indexOf(contact));
          }
          if ($scope.meetingLocation._id !== null && angular.isDefined($scope.meetingLocation._id))
            $scope.contacts.deletedContacts.push(contact);
        }
      };

      // Create the meeting form modal that we will use later
      $ionicModal.fromTemplateUrl('templates/meetingLocationForm.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });

      // Create the meetings list modal that we will use later
      $ionicModal.fromTemplateUrl('templates/meetingsList.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.meetingsListModal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeMeetingsList = function () {
        $scope.meetingsListModal.hide();
        if($rootScope.map)
          $rootScope.map.setClickable(true);
      };

      // Open the meeting form modal
      $scope.openMeetingsList = function (meetingLocation, marker) {
        if($rootScope.map)
          $rootScope.map.setClickable(false);


        $scope.meetingsListModal.show();

      };


      $scope.goToMeeting = function (meetingLocation, marker) {
        MapService.map.animateCamera({
          'target': new plugin.google.maps.LatLng(meetingLocation.latitude, meetingLocation.longitude),
          'zoom': 17
        }, function() {
          $scope.openMeetingForm(meetingLocation, marker);
        });
        $scope.meetingsListModal.hide();

      };

      // Triggered in the login modal to close it
      $scope.closeMeetingForm = function () {
        $scope.modal.hide();
        if($rootScope.map)
          $rootScope.map.setClickable(true);
      };

      // Open the meeting form modal
      $scope.openMeetingForm = function (meetingLocation, marker) {
        if($rootScope.map)
          $rootScope.map.setClickable(false);
        // Form data for the meeting location modal
        $scope.searchTerm.term = '';

        $scope.contacts = {
          selectedContacts: [],
          deletedContacts: []
        };
        if (marker) {
          MeetingLocationService.marker = marker;
        }

        if (meetingLocation._id !== null && angular.isDefined(meetingLocation._id)) {
          MeetingLocationService.getMeetingLocations(meetingLocation._id).then(function (location) {
            $scope.meetingLocation = {};
            $scope.meetingLocation.ownerId = location.data.ownerId;
            $scope.meetingLocation.name = location.data.name || "";
            $scope.meetingLocation.description = location.data.description || "";
            $scope.meetingLocation.private = location.data.private || false;
            $scope.meetingLocation.date = location.data.date ? new Date(Date.parse(location.data.date)) : null;
            $scope.meetingLocation.phoneNumber = UserFactory.currentUser.phoneNumber.replace(/\D+/g, "").replace(/^[01]+/, "");
            $scope.meetingLocation.attendees = location.data.attendees || [];
            $scope.meetingLocation._id = location.data._id || null;

            $scope.modal.show();
          });
        } else {
          $scope.meetingLocation = {};
          $scope.meetingLocation.ownerId = UserFactory.currentUser.id;
          $scope.meetingLocation.name = "";
          $scope.meetingLocation.description = "";
          $scope.meetingLocation.private = false;
          $scope.meetingLocation.date = null;
          $scope.meetingLocation.phoneNumber = UserFactory.currentUser.phoneNumber.replace(/\D+/g, "").replace(/^[01]+/, "");
          $scope.meetingLocation.attendees = [];
          $scope.meetingLocation._id = null;

          $scope.modal.show();
        }

      };

      // Perform the login action when the user submits the login form
      $scope.saveMeetingLocation = function () {

        MeetingLocationService.marker.getPosition(function (latLng) {
          $scope.meetingLocation.latitude = latLng.lat;
          $scope.meetingLocation.longitude = latLng.lng;

          var action = $scope.meetingLocation._id == null || !angular.isDefined($scope.meetingLocation._id)? Constants.ACTIONS.CREATE : Constants.ACTIONS.UPDATE;
          MeetingLocationService.saveMeetingLocation($scope.meetingLocation, $scope.contacts.selectedContacts, $scope.contacts.deletedContacts, action).then(function (location) {
            if (angular.isDefined(location.data) && location.data != null) {
              MeetingLocationService.marker.setTitle(location.data.name);
              MeetingLocationService.marker.setPosition(new plugin.google.maps.LatLng(location.data.latitude, location.data.longitude));
              MeetingLocationService.marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                $scope.openMeetingForm(location.data, MeetingLocationService.marker);
                event.preventDefault();
              });

              $scope.closeMeetingForm();
              location.data.marker = MeetingLocationService.marker;
              switch (location.data.action) {
                case Constants.ACTIONS.CREATE:
                  UserFactory.currentUser.meetingLocations.push(location.data);
                  break;
                case Constants.ACTIONS.UPDATE:
                  for(var mInd = 0; mInd < UserFactory.currentUser.meetingLocations.length; mInd++) {
                    if(UserFactory.currentUser.meetingLocations[mInd]["_id"] == location.data["_id"]) {
                      UserFactory.currentUser.meetingLocations[mInd] = location.data;
                      break;
                    }
                  }
                  break;
                case Constants.ACTIONS.DELETE:
                  for(var mInd = 0; mInd < UserFactory.currentUser.meetingLocations.length; mInd++) {
                    if(UserFactory.currentUser.meetingLocations[mInd]["_id"] == location.data["_id"]) {
                      UserFactory.currentUser.meetingLocations.splice(mInd, 1);
                      break;
                    }
                  }
                  break;
                default:
                  break;
              }

              $scope.meetingsList = UserFactory.currentUser.meetingLocations;


              /*  google.maps.event.addListener(MeetingLocationService.marker, 'click', function () {
               MeetingLocationService.marker.infoWindow.setContent(location.data.description);
               MeetingLocationService.marker.infoWindow.open(MapService.map, this);
               event.preventDefault();
               });
               google.maps.event.addListener(MeetingLocationService.marker, 'dblclick', function () {
               MeetingLocationService.marker.infoWindow.close();
               $scope.openMeetingForm(location.data, MeetingLocationService.marker);
               event.preventDefault();
               });*/
            }
          }, function (err) {
            console.log(err);
            return null;
          });
        });
      };
    }]);
