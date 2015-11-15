// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories', 'ngCordova'])

  .run(function ($ionicPlatform, $rootScope, $state, UserFactory) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
/*      if($rootScope.map) {
        $rootScope.map.setClickable( false );
      }*/

      if (!UserFactory.currentUser.isAuthenticated) {
        if (next.name !== 'app.login') {
          event.preventDefault();
          $state.go('app.login');
        }
      }

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })
      .state('app.login', {
        url: '/login',
        views: {
          'tab-login': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('app.maps', {
        url: '/maps',
        views: {
          'tab-map': {
            templateUrl: 'templates/maps.html',
            controller: 'MapCtrl'
          }
        },
        onEnter: function($rootScope){
          if($rootScope.map) {
            $rootScope.map.setClickable(true);
          }

        },
        onExit: function($rootScope){
          if($rootScope.map) {
            $rootScope.map.setClickable(false);
          }
        }
      });
     /* .state('app.createMeetingLocation', {
        url: '/createMeetingLocation',
        views: {
          'menuContent': {
            template: 'templates/maps.html',
            controller: 'MeetingCtrl',
            animation: 'slide'
          }
        }
      });*/
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  });
