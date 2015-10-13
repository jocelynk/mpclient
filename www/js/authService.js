angular.module('starter.services')

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])

  .service('AuthService', ['$q', '$http', function($q, $http) {
    $http.defaults.useXDomain = true;
    var userObject = {
      name: '',
      phoneNumber: '',
      isAuthenticated: false
    };

    function useCredentials(phoneNumber) {
      return $http.get('http://localhost:3000/users', {params:{'phoneNumber':phoneNumber}}).then(function(user) {
        if(angular.isDefined(user.data[0]) && user.data[0] != null) {
          return user.data[0];
        } else {
          return $http.post('http://localhost:3000/users', {'phoneNumber' : phoneNumber, 'name': phoneNumber}).then(function(user) {
            if(angular.isDefined(user.data.ops[0]) && user.data.ops[0] != null) {
              return user.data.ops[0];
            }
          }, function(err) {
            console.log(err);
            return null;
          });
        }
      }, function(err) {
        console.log(error);
      });
    }

    var login = function() {
      return $q(function(resolve, reject) {
        if(window.plugins && window.plugins.sim) {
          window.plugins.sim.getSimInfo(function (simInfo) {
            var phoneNumber = simInfo.phoneNumber.toString().trim().replace(/[^\d\+]/g,"");
            useCredentials(phoneNumber).then(function(user) {
              if(user == null || !angular.isDefined(user)) {
                reject(userObject);
              } else {
                userObject.id = user._id;
                userObject.name = user.name;
                userObject.phoneNumber = user.phoneNumber;
                userObject.isAuthenticated = true;
                resolve(userObject);
              }

            });
          }, function (error) {
            console.log(error);
            //or resolve to userObject with isAuthenticated set to false
            reject(userObject);
          });
        } else {
          //temporarily use random guid if phonenumber not available, change functionality later
          var guid = rdmGuid();
          useCredentials(guid).then(function(user) {
            if(user == null || !angular.isDefined(user)) {
              reject(userObject);
            } else {
              userObject.id = user._id;
              userObject.name = user.name;
              userObject.phoneNumber = user.phoneNumber;
              userObject.isAuthenticated = true;
              resolve(userObject);
            }
          });

        }

      });
    };

    return {
      login: login
    };
  }]);

function rdmGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1);
  }

  return s4();
  //return s4() + s4() + '-' + s4() + '-' + s4() + s4();
}

