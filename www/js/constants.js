angular.module('starter.helpers')

  .factory('Constants', function() {
    return {
      ACTIONS: {
        CREATE: 'CREATE',
        READ: 'READ',
        UPDATE: 'UPDATE',
        DELETE: 'DELETE'
      },
      URLS: {
        USER: {
          GET: 'http://mp-server.herokuapp.com:80/user/',
          POST: 'http://mp-server.herokuapp.com:80/user/'
        },
        MEETING: {
          GET: 'http://mp-server.herokuapp.com:80/meeting/',
          POST: 'http://mp-server.herokuapp.com:80/meeting/',
          PUT: 'http://mp-server.herokuapp.com:80/meeting/'
        },
        SOCKETS: {
          server: 'http://mp-server.herokuapp.com:80'
        }
      }
    };
  });
