angular.module('starter.controllers', ['ngCordova', 'starter.factories', 'starter.services'])

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
  .controller('LoginCtrl',['$scope', 'UserFactory', 'AuthService', function($scope, UserFactory, AuthService) {
    AuthService.login().then(function(credentials) {
      if(angular.isDefined(credentials) && credentials != null) {
        UserFactory.currentUser.id = credentials.id;
        UserFactory.currentUser.name = credentials.name;
        UserFactory.currentUser.phoneNumber = credentials.phoneNumber;
        UserFactory.currentUser.isAuthenticated = credentials.isAuthenticated;
      } else {
        //handle not being able to login
      }

    });
  }])
  .controller('MapCtrl', ['$scope', '$cordovaGeolocation', '$ionicPlatform', 'DeviceInformationFactory', 'UserFactory', 'MapService', 'LocationService', function ($scope, $cordovaGeolocation, $ionicPlatform, DeviceInformationFactory, UserFactory, MapService, LocationService) {

    $scope.refreshTimeout = null;
    $scope.refreshLocationTimeout = null;


    $ionicPlatform.ready(function () {
      if (!navigator.geolocation) {
        $ionicPopup.alert({
          title: 'Location Services Disabled',
          content: 'Please enable location services.'
        }).then(function(res) {
          console.log('Location Services was not enabled: ' + res);
        });
      } else {

          if(window.cordova) {
            LocationService.getCordovaCurrentLocation();
          } else {
            LocationService.getWebCurrentLocation();
          }

          LocationService.connectSockets();

          // Refresh the markers every 2 seconds
          clearTimeout($scope.refreshLocationTimeout)
          $scope.refreshLocationTimeout = setTimeout(function () {
            var position = {};
            position.coords = {latitude:  UserFactory.currentUser.coordinates.latitude, longitude:  UserFactory.currentUser.coordinates.longitude};
            LocationService.geo_success(position);
          }, 1000 * 2);

          setInterval(function () {
            var position = {};
            position.coords = {latitude:  UserFactory.currentUser.coordinates.latitude, longitude:  UserFactory.currentUser.coordinates.longitude};
            LocationService.geo_success(position);
          }, 2000);
        //possibly use ionicView.enter
        /*$scope.$on('$ionicView.enter', function(){
        });*/
      }
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
