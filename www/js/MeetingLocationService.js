angular.module('starter.factories')


  .factory('MeetingLocationService', ['$timeout', '$q', '$http', 'UserFactory', 'MapService', 'ContactsService', function($timeout, $q, $http, UserFactory, MapService, ContactsService) {
    var MeetingLocationService = {};
    MeetingLocationService.marker = null;

    MeetingLocationService.getMeetingLocations = function() {
      return $http.get('http://mp-server.herokuapp.com/meeting/' + UserFactory.phoneNumber)
        .then(function(locations) {
          return locations;
        }, function(err) {
          console.log(err);
          return null;
        });
    };
    //JSON.stringify(ids)

    MeetingLocationService.saveMeetingLocation = function(meetingLocation) {
      return $http.post('http://mp-server.herokuapp.com/meeting', meetingLocation);
    };

    MeetingLocationService.deleteMeetingLocations = function() {

    };

    return MeetingLocationService;

  }]);
