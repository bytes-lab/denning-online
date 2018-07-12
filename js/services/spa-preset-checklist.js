denningOnline
    // =========================================================================
    // Billing Items
    // =========================================================================
    
    .service('spapresetclService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.spapresetcls = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.spapresetcls) {
                var deferred = $q.defer();
                deferred.resolve(service.spapresetcls);
                return deferred.promise;
            } else {
                return $http.get('data/spapresetcls.json')
                .then(function(resp){
                    service.spapresetcls = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.spapresetcls) {
                var deferred = $q.defer();
                var item = service.spapresetcls.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.spapresetcls.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(spapresetcl) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.spapresetcls.map(function(c) { return c.code; }).indexOf(spapresetcl.code);
                if(idx != -1) {
                    service.spapresetcls[idx] = spapresetcl;
                } else {
                    // should be done on server side
                    spapresetcl.code = Math.floor(Math.random() * 1000 + 1);
                    service.spapresetcls.push(spapresetcl);
                }

                // @@ send post request to server to save the item
                deferred.resolve(spapresetcl);
            }, 100);

            return deferred.promise;
        }

        function delete_(spapresetcl) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.spapresetcls.map(function(c) { return c.code; }).indexOf(spapresetcl.code);
                if(idx != -1) {
                    service.spapresetcls.splice(idx, 1);
                    deferred.resolve(spapresetcl);
                } else {
                    deferred.reject(new Error('There is no such spapresetcl'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
