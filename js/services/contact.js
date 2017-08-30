materialAdmin
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('contactService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.contacts = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.contacts) {
                var deferred = $q.defer();
                deferred.resolve(service.contacts);
                return deferred.promise;
            } else {
                return $http.get('data/contacts.json')
                .then(function(resp){
                    service.contacts = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.contacts) {
                var deferred = $q.defer();
                var item = service.contacts.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.contacts.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(contact) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.contacts.map(function(c) { return c.code; }).indexOf(contact.code);
                if(idx != -1) {
                    service.contacts[idx] = contact;
                } else {
                    // should be done on server side
                    contact.code = Math.floor(Math.random() * 1000 + 1);
                    service.contacts.push(contact);
                }

                // @@ send post request to server to save the item
                deferred.resolve(contact);
            }, 100);

            return deferred.promise;
        }

        function delete_(contact) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.contacts.map(function(c) { return c.code; }).indexOf(contact.code);
                if(idx != -1) {
                    service.contacts.splice(idx, 1);
                    deferred.resolve(contact);
                } else {
                    defered.reject(new Error('There is no such contact'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
