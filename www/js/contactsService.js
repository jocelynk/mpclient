angular.module('starter.services')

  .service('ContactsService', ['$q', function ($q) {
    var formatContact = function (contact) {
      var phoneNumber = '';

      for (var i = 0; i < contact.phoneNumbers.length; i++) {
        if (contact.phoneNumbers[i].type == 'mobile') {
          phoneNumber = contact.phoneNumbers[i].value;
          break;
        }
      }

      return {
        "name": contact.displayName || "Mystery Person",
        "phoneNumber": phoneNumber.replace(/\D+/g, "").replace(/^[01]+/, "")
      };

    };
    var pickContact = function () {
      var deferred = $q.defer();

      if (navigator && navigator.contacts) {

        navigator.contacts.pickContact(function (contact) {

          deferred.resolve(formatContact(contact));
        });

      }
      else {
        deferred.reject("Bummer.  No contacts in desktop browser");
      }

      return deferred.promise;
    };

    var findContactsBySearchTerm = function (searchTerm) {
      var deferred = $q.defer();
      var fields = ['displayName', 'name', 'phoneNumber'];
      var opts = {                                           //search options
        filter: searchTerm,                                 // 'Bob'
        multiple: true,                                      // Yes, return any contact that matches criteria
                      // These are the fields to search for 'bob'.
        desiredFields: ['displayName', 'name', 'phoneNumbers']    //return fields.
      };

      /*     if ($ionicPlatform.isAndroid()) {
       opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
       }*/
      if (navigator && navigator.contacts) {
        navigator.contacts.find(fields, function (contactsFound) {
          var contacts = [];
          for (var i = 0; i < contactsFound.length; i++) {
            contacts.push(formatContact(contactsFound[i]));
          }
          console.log(contacts);
          deferred.resolve(contacts)

        }, function (err) {
          console.log(err);
          deferred.reject("Error retrieving contacts")

        }, opts);
      } else {
        deferred.reject("Contacts not enabled for web.")
      }


      return deferred.promise;
    };

    return {
      pickContact: pickContact,
      searchContacts: findContactsBySearchTerm
    };

  }]);
