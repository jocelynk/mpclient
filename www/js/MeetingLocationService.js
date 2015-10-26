angular.module('starter.factories')


  .factory('MeetingLocationService', ['$timeout', '$q', '$http', 'UserFactory', 'MapService', 'ContactsService', function($timeout, $q, $http, UserFactory, MapService, ContactsService) {
    var MeetingLocationService = {};
    MeetingLocationService.marker = null;

    MeetingLocationService.getMeetingLocations = function() {
      return $http.get('http://10.128.7.17:5000/meeting/' + UserFactory.phoneNumber)
        .then(function(locations) {
          return locations;
        }, function(err) {
          console.log(err);
          return null;
        });
    };
    //JSON.stringify(ids)

    MeetingLocationService.saveMeetingLocation = function(meetingLocation, newContacts, deletedContacts) {
      return $http.post('http://10.128.7.17:5000/meeting', {meetingLocation: meetingLocation, newContacts: newContacts, deletedContacts: deletedContacts});
    };

    MeetingLocationService.deleteMeetingLocations = function() {

    };

    return MeetingLocationService;

  }]);
