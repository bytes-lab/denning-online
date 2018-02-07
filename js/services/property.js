materialAdmin
    // =========================================================================
    // Properties
    // =========================================================================
    
    .service('propertyService', function($q, $timeout, $http) {
        var service = {};

        service.properties = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            return $http({
                method: 'GET',
                url: 'http://43.252.215.81/denningwcf/v1/property?search=ho',
                headers: {
                    "Content-Type": "application/json",
                    "webuser-sessionid": "testdenningSkySea"
                }
            }).then(function(resp) {
                service.properties = resp.data;
                return resp.data;
            });    
        }

        function getItem(code) {
            return $http({
                method: 'GET',
                url: 'http://43.252.215.81/denningwcf/v1/app/propertie/'+code,
                headers: {
                    "Content-Type": "application/json",
                    "webuser-sessionid": "testdenningSkySea"
                }
            }).then(function(resp) {
                return resp.data;
            });    
        }

        function save(propertie) {
            var method = propertie.code ? 'PUT': 'POST';
            delete propertie.relatedMatter;

            return $http({
                method: method,
                url: 'http://43.252.215.81/denningwcf/v1/app/propertie',
                headers: {
                    "Content-Type": "application/json",
                    "webuser-sessionid": "testdenningSkySea"
                },
                data: propertie
            }).then(function(response) {
                return response.data;
            });
        }

        function delete_(propertie) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.properties.map(function(c) { return c.code; }).indexOf(propertie.code);
                if(idx != -1) {
                    service.properties.splice(idx, 1);
                    deferred.resolve(propertie);
                } else {
                    deferred.reject(new Error('There is no such propertie'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;        
    })
