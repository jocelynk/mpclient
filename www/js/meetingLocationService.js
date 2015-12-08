angular.module('starter.factories')


  .factory('MeetingLocationService', ['$timeout', '$q', '$http', 'Constants', 'UserFactory', function($timeout, $q, $http, Constants, UserFactory) {
    var MeetingLocationService = {};
    MeetingLocationService.marker = null;

    MeetingLocationService.getMeetingLocations = function(meetingId) {
      return $http.get(Constants.URLS.MEETING.GET + meetingId)
        .then(function(locations) {
          return locations;
        }, function(err) {
          console.log(err);
          return null;
        });
    };
    //JSON.stringify(ids)

    MeetingLocationService.saveMeetingLocation = function(meetingLocation, newContacts, deletedContacts, action) {
      if(action == Constants.ACTIONS.CREATE)
        return $http.post(Constants.URLS.MEETING.POST, {meetingLocation: meetingLocation, newContacts: newContacts, deletedContacts: deletedContacts});
      else if(action == Constants.ACTIONS.UPDATE)
        return $http.put(Constants.URLS.MEETING.PUT, {meetingLocation: meetingLocation, newContacts: newContacts, deletedContacts: deletedContacts});
    };

    MeetingLocationService.deleteMeetingLocations = function() {

    };

    return MeetingLocationService;

  }]);
