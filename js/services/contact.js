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
            var method = contact.code ? 'PUT': 'POST';
            delete contact.relatedMatter;

            return $http({
                method: method,
                url: 'http://43.252.215.81/denningwcf/v1/app/contact',
                headers: {
                    "Content-Type": "application/json",
                    "webuser-sessionid": "testdenningSkySea"
                },
                data: contact
            }).then(function(response) {
                return response.data;
            });
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
