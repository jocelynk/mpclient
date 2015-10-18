angular.module('starter.factories')

  .factory('MeetingLocationService', ['$timeout', '$q', '$http', 'UserFactory', function($timeout, $q, $http, UserFactory) {
    var MeetingLocationService = {};
    MeetingLocationService.marker = null;

    MeetingLocationService.getMeetingLocations = function() {
      return $http.get('http://192.168.1.4:5000/meeting/' + UserFactory.phoneNumber)

        .then(function(locations) {
          return locations;
        }, function(err) {
          console.log(err);
          return null;
        });
    };
    //JSON.stringify(ids)

    MeetingLocationService.saveMeetingLocation = function(meetingLocation) {
      return $http.post('http://192.168.1.4:5000/meeting', meetingLocation);
    };

    MeetingLocationService.deleteMeetingLocations = function() {

    };

    return MeetingLocationService;

  }]);
