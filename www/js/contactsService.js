angular.module('starter.services')

  .service('ContactsService', ['$q', function($q) {
  	var formatContact = function(contact) {

            return {
                "displayName"   : contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Mystery Person",
                "phones"        : contact.phoneNumbers || [],
            };

        };
    var pickContact = function(){
    	var deferred = $q.defer();

            if (navigator && navigator.contacts) {

                navigator.contacts.pickContact(function(contact){

                    deferred.resolve( formatContact(contact) );
                });

            } 
            else {
                deferred.reject("Bummer.  No contacts in desktop browser");
            }

            return deferred.promise;
    };
    return {
            pickContact : pickContact
        };

}]);