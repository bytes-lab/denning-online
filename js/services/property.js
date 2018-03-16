materialAdmin
    // =========================================================================
    // Properties
    // =========================================================================
    
    .service('propertyService', function($q, $timeout, $http, Auth) {
        var service = {};

        service.properties = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;
        service.headers = Auth.isAuthenticated();

        function getList() {
            return $http({
                method: 'GET',
                url: 'http://43.252.215.81/denningwcf/v1/property?search=ho',
                headers: service.headers
            }).then(function(resp) {
                service.properties = resp.data;
                return resp.data;
            });    
        }

        function getItem(code) {
            return $http({
                method: 'GET',
                url: 'http://43.252.215.81/denningwcf/v1/app/property/'+code,
                headers: service.headers
            }).then(function(resp) {
                return resp.data;
            });    
        }

        function save(property) {
            var method = property.code ? 'PUT': 'POST';
            delete property.relatedMatter;

            return $http({
                method: method,
                url: 'http://43.252.215.81/denningwcf/v1/property',
                headers: service.headers,
                data: property
            }).then(function(response) {
                return response.data;
            });
        }

        function delete_(property) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.properties.map(function(c) { return c.code; }).indexOf(property.code);
                if(idx != -1) {
                    service.properties.splice(idx, 1);
                    deferred.resolve(property);
                } else {
                    deferred.reject(new Error('There is no such property'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;        
    })
