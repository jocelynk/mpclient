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
    //module('ngMap');
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

    var BaseClass = function() {
      var self = this;
      var _vars = {};
      var _listeners = {};

      self.empty = function() {
        for (var key in Object.keys(_vars)) {
          _vars[key] = null;
          delete _vars[key];
        }
      };

      self.get = function(key) {
        return key in _vars ? _vars[key] : null;
      };
      self.set = function(key, value) {
        if (_vars[key] !== value) {
          self.trigger(key + "_changed", _vars[key], value);
        }
        _vars[key] = value;
      };

      self.trigger = function(eventName) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        var event = document.createEvent('Event');
        event.initEvent(eventName, false, false);
        event.mydata = args;
        event.myself = self;
        document.dispatchEvent(event);
      };
      self.on = function(eventName, callback) {
        _listeners[eventName] = _listeners[eventName] || [];

        var listener = function (e) {
          if (!e.myself || e.myself !== self) {
            return;
          }
          callback.apply(self, e.mydata);
        };
        document.addEventListener(eventName, listener, false);
        _listeners[eventName].push({
          'callback': callback,
          'listener': listener
        });
      };
      self.addEventListener = self.on;

      self.off = function(eventName, callback) {
        var i;
        if (typeof eventName === "string"){
          if(eventName in _listeners) {

            if (typeof callback === "function") {
              for (i = 0; i < _listeners[eventName].length; i++) {
                if (_listeners[eventName][i].callback === callback) {
                  document.removeEventListener(eventName, _listeners[eventName][i].listener);
                  _listeners[eventName].splice(i, 1);
                  break;
                }
              }
            } else {
              for (i = 0; i < _listeners[eventName].length; i++) {
                document.removeEventListener(eventName, _listeners[eventName][i].listener);
              }
              delete _listeners[eventName];
            }
          }
        } else {
          //Remove all event listeners
          var eventNames = Object.keys(_listeners);
          for (i = 0; i < eventNames.length; i++) {
            eventName = eventNames[i];
            for (var j = 0; j < _listeners[eventName].length; j++) {
              document.removeEventListener(eventName, _listeners[eventName][j].listener);
            }
          }
          _listeners = {};
        }
      };

      self.removeEventListener = self.off;


      self.one = function(eventName, callback) {
        _listeners[eventName] = _listeners[eventName] || [];

        var listener = function (e) {
          if (!e.myself || e.myself !== self) {
            return;
          }
          callback.apply(self, e.mydata);
          self.off(eventName, callback);
        };
        document.addEventListener(eventName, listener, false);
        _listeners[eventName].push({
          'callback': callback,
          'listener': listener
        });
      };
      self.addEventListenerOnce = self.one;

      self.errorHandler = function(msg) {
        if (msg) {
          console.error(msg);
          self.trigger('error', msg);
        }
        return false;
      };

      return self;
    };

    var LatLng = function(latitude, longitude) {
      var self = this;
      /**
       * @property {Number} latitude
       */
      self.lat = parseFloat(latitude || 0, 10);

      /**
       * @property {Number} longitude
       */
      self.lng = parseFloat(longitude || 0, 10);

      /**
       * Comparison function.
       * @method
       * @return {Boolean}
       */
      self.equals = function(other) {
        other = other || {};
        return other.lat === self.lat &&
          other.lng === self.lng;
      };

      /**
       * @method
       * @return {String} latitude,lontitude
       */
      self.toString = function() {
        return self.lat + "," + self.lng;
      };

      /**
       * @method
       * @param {Number}
       * @return {String} latitude,lontitude
       */
      self.toUrlValue = function(precision) {
        precision = precision || 6;
        return self.lat.toFixed(precision) + "," + self.lng.toFixed(precision);
      };
    };

    var Marker = function(map, id, markerOptions) {
      BaseClass.apply(this);

      var self = this;

      Object.defineProperty(self, "map", {
        value: map,
        writable: false
      });
      Object.defineProperty(self, "hashCode", {
        value: markerOptions.hashCode,
        writable: false
      });
      Object.defineProperty(self, "id", {
        value: id,
        writable: false
      });
      Object.defineProperty(self, "type", {
        value: "Marker",
        writable: false
      });

      var ignores = ["hashCode", "id", "hashCode", "type"];
      for (var key in markerOptions) {
        if (ignores.indexOf(key) === -1) {
          self.set(key, markerOptions[key]);
        }
      }
    };

    module.exports = {
      event : {
        MAP_CLICK: 'click',
        MAP_LONG_CLICK: 'long_click',
        MY_LOCATION_CHANGE: 'my_location_change', // for Android
        MY_LOCATION_BUTTON_CLICK: 'my_location_button_click',
        INDOOR_BUILDING_FOCUSED: 'indoor_building_focused',
        INDOOR_LEVEL_ACTIVATED: 'indoor_level_activated',
        CAMERA_CHANGE: 'camera_change',
        CAMERA_IDLE: 'camera_idle', //for iOS
        MAP_READY: 'map_ready',
        MAP_LOADED: 'map_loaded', //for Android
        MAP_WILL_MOVE: 'will_move', //for iOS
        MAP_CLOSE: 'map_close',
        MARKER_CLICK: 'click',
        OVERLAY_CLICK: 'overlay_click',
        INFO_CLICK: 'info_click',
        MARKER_DRAG: 'drag',
        MARKER_DRAG_START: 'drag_start',
        MARKER_DRAG_END: 'drag_end'
      },
      Animation: {
        BOUNCE: 'BOUNCE',
        DROP: 'DROP'
      },
      BaseClass: BaseClass,
      LatLng: LatLng,
      Marker: Marker,
      MapTypeId: {
        'NORMAL': 'MAP_TYPE_NORMAL',
        'ROADMAP': 'MAP_TYPE_NORMAL',
        'SATELLITE': 'MAP_TYPE_SATELLITE',
        'HYBRID': 'MAP_TYPE_HYBRID',
        'TERRAIN': 'MAP_TYPE_TERRAIN',
        'NONE': 'MAP_TYPE_NONE'
      }
    };


    plugin = {google: { maps: module.exports}};

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
/*    mapService.longPress = true;
    var e = {latLng: new google.maps.LatLng(1, 1)};

    scope.placeMarker(e);
    expect(scope.openMeetingForm).toHaveBeenCalled();*/

  });

});
