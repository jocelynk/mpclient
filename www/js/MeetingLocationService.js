angular.module('starter.factories')


  .factory('MeetingLocationService', ['$timeout', '$q', '$http', 'UserFactory', 'MapService', 'ContactsService', function($timeout, $q, $http, UserFactory, MapService, ContactsService) {
    var MeetingLocationService = {};
    MeetingLocationService.marker = null;

    MeetingLocationService.getMeetingLocations = function() {
      return $http.get('http://192.168.1.4:5000/meetingLocations', {params:{'locationIds':UserFactory.meetingLocations}})

        .then(function(locations) {
          return locations;
        }, function(err) {
          console.log(err);
          return null;
        });
    };
    //JSON.stringify(ids)

    MeetingLocationService.saveMeetingLocation = function(meetingLocation) {
      return $http.post('http://192.168.1.4:5000/meetingLocations', {'location' : meetingLocation});

    };

    MeetingLocationService.deleteMeetingLocations = function() {

    };

    return MeetingLocationService;

  }]);
