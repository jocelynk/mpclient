angular.module('starter.helpers')

  .factory('Constants', function() {
    return {
      URLS: {
        USER: {
          GET: 'http://192.168.1.4:5000/user/',
          POST: 'http://192.168.1.4:5000/user/'
        },
        MEETING: {
          GET: 'http://192.168.1.4:5000/meeting/',
          POST: 'http://192.168.1.4:5000/meeting/'
        },
        SOCKETS: {
          server: 'http://192.168.1.4:5000'
        }
      }
    };
  });
