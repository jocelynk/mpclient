describe('Testing MapCtrl', function() {
  var controller,
    MapCtrl,
    userFactory,
    locationService,
    mapService,
    meetingLocationService,
    scope,
    compile,
    ionicPlatform,
    cordovaGeolocation;

  beforeEach(function() {
    module('ngCordovaMocks');
    module('ngMap');
    angular.mock.module('starter.factories');
    angular.mock.module('starter.services');
    angular.mock.module('starter.controllers');

  });

  beforeEach(inject(function ($rootScope, $controller, $q, $cordovaGeolocation, $compile, _UserFactory_, _LocationService_, _MapService_, _MeetingLocationService_) {
    scope = $rootScope.$new();

    compile = $compile;


    cordovaGeolocation = $cordovaGeolocation;
    userFactory = _UserFactory_;
    locationService = _LocationService_;
    mapService = _MapService_;
    meetingLocationService = _MeetingLocationService_;
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

    MapCtrl = $controller('MapCtrl', {
      $scope: scope,
      $cordovaGeolocation: cordovaGeolocation,
      $ionicPlatform: ionicPlatform,
      UserFactory: userFactory,
      MapService: mapService,
      MeetingLocationService: meetingLocationService
    });
    mapService.map = new google.maps.Map(document.body, {});

    spyOn(scope, 'openMeetingForm');




  }));

  it('testing Map Controller', function () {

    expect(ionicPlatform.ready).toHaveBeenCalled();

  });

  it('testing Map Controller functions', function () {
    mapService.longPress = true;
    var e = {latLng: new google.maps.LatLng(1, 1)};

    scope.placeMarker(e);
    expect(scope.openMeetingForm).toHaveBeenCalled();

  });

});
