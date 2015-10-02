describe('Testing MapCtrl', function() {

  beforeEach(angular.mock.module('starter.controllers'));

  var controller,
    MapCtrl,
    scope,
    compile,
    ionicPlatform,
    cordovaGeolocation;

  beforeEach(function() {
    module('ngCordovaMocks');
  });

  beforeEach(inject(function ($rootScope, $controller, $q, $cordovaGeolocation, $compile) {
    scope = $rootScope.$new();

    compile = $compile;


    cordovaGeolocation = $cordovaGeolocation;
    ionicPlatform = {
      ready: function(callback) {
        callback();
      }
    };

    spyOn(ionicPlatform, 'ready');
    controller = $controller;

    var html = '<div id="map"></div>';
    var elem = angular.element(html);  // turn html into an element object
    document.body.appendChild(elem[0]);
    compile(elem)(scope); // compile the html
    scope.$digest();  // update the scope

    MapCtrl = controller('MapCtrl', {
      $scope: scope,
      $cordovaGeolocation: cordovaGeolocation,
      $ionicPlatform: ionicPlatform
    });


  }));

  it('testing Map Controller', function () {

    expect(ionicPlatform.ready).toHaveBeenCalled();

  });

});
