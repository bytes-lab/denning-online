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
                return $http({
                    method: 'GET',
                    url: 'http://43.252.215.81/denningwcf/v1/party',
                    headers: {
                        "Content-Type": "application/json",
                        "webuser-sessionid": "testdenningSkySea"
                    }
                }).then(function(resp) {
                    service.contacts = resp.data;                
                    return resp.data;
                });    
            }
        }

        function getItem(code) {
            return $http({
                method: 'GET',
                url: 'http://43.252.215.81/denningwcf/v1/app/contact/'+code,
                headers: {
                    "Content-Type": "application/json",
                    "webuser-sessionid": "testdenningSkySea"
                }
            }).then(function(resp) {
                return resp.data;
            });    
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
                    deferred.reject(new Error('There is no such contact'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
