
describe('Testing Location Service', function() {
  var locationService,
    deferred,
    ionicPlatform,
    cordovaGeolocation,
    userFactory,
    expected;

  beforeEach(function() {
    module('starter.factories');
    module('ngCordovaMocks');

  });

  beforeEach(inject(function ($q, _LocationService_, _UserFactory_) {

    locationService = _LocationService_;
    userFactory = _UserFactory_;
    userFactory.currentUser.coordinates = {};


    locationService.geo_success = function() {
      console.log("test");
    };

    expected = {coords: { longitude:1, latitude:1 }, timestamp:Date()};

    deferred = $q.defer();
    deferred.resolve(expected); //  always resolved, you can do it from your spec

    //cordovaGeolocation = $cordovaGeolocation;

    //spyOn(cordovaGeolocation, 'getCurrentPosition').and.returnValue(deferred.promise);
    //spyOn(locationService, 'geo_success');//.and.returnValue(deferred.promise);




  }));

  it('should update the user\'s current position', function () {

    beforeEach(function() {
        locationService.getCordovaCurrentLocation();
    });

    //cordovaGeolocation.currentPosition = expected;
    //cordovaGeolocation.useHostAbilities = false;

    //expect(cordovaGeolocation.getCurrentPosition).toHaveBeenCalled();
    /*cordovaGeolocation.getCurrentPosition()
      .then(
      function(actual) {
        expect(actual).toBe(expected);
      },
      function() { expect(false).toBe(true); }
    ).finally(function() { done(); });*/

    //expect(locationService.geo_success).toHaveBeenCalled();
    //expect(userFactory.currentUser.coordinates.latitude).toBe(expected.coords.latitude);
    //expect(userFactory.currentUser.coordinates.longitude).toBe(expected.coords.longitude);
  });

/*  it('should throw an error while getting the current position.', function(done) {
    $cordovaGeolocation.throwsError = true;
    $cordovaGeolocation.getCurrentPosition()
      .then(
      function(actual) { expect(false).toBe(true); },
      function() { expect(true).toBe(true); }
    )
      .finally(function() { done(); })
    ;

    $rootScope.$digest();
  });

  it('should track five locations over an interval', function() {
    $cordovaGeolocation.useHostAbilities = false;

    var watch = $cordovaGeolocation.watchPosition(gpsOptions);
    watch.then(
      function() { },
      function(err) { expect(false).toBe(true); },
      function(result) {
        count = count + 1;
      }
    );

    $interval.flush(5000);
    $rootScope.$digest();

    expect(count).toBe(5);
  });

  it('should clear a created watch', function() {
    $cordovaGeolocation.useHostAbilities = false;

    var watch = $cordovaGeolocation.watchPosition(gpsOptions);
    watch.then(
      function() { },
      function(err) { expect(false).toBe(true); },
      function(result) {
        count = count + 1;
      }
    );

    $interval.flush(5000);
    $cordovaGeolocation.clearWatch(watch.watchID);
    $rootScope.$digest();

    expect(count).toBe(5);
  });

  it('should cancel a created watch', function() {
    $cordovaGeolocation.useHostAbilities = false;

    var watch = $cordovaGeolocation.watchPosition(gpsOptions);
    watch.then(
      function() { },
      function(err) { expect(false).toBe(true); },
      function(result) {
        count = count + 1;
      }
    );

    $interval.flush(5000);
    watch.cancel();
    $rootScope.$digest();

    expect(count).toBe(5);
  });*/


});
