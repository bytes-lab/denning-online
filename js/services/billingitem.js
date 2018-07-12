denningOnline
    // =========================================================================
    // Billing Items
    // =========================================================================
    
    .service('billingitemService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.billingitems = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.billingitems) {
                var deferred = $q.defer();
                deferred.resolve(service.billingitems);
                return deferred.promise;
            } else {
                return $http.get('data/billingitems.json')
                .then(function(resp){
                    service.billingitems = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.billingitems) {
                var deferred = $q.defer();
                var item = service.billingitems.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.billingitems.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(billingitem) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.billingitems.map(function(c) { return c.code; }).indexOf(billingitem.code);
                if(idx != -1) {
                    service.billingitems[idx] = billingitem;
                } else {
                    // should be done on server side
                    billingitem.code = Math.floor(Math.random() * 1000 + 1);
                    service.billingitems.push(billingitem);
                }

                // @@ send post request to server to save the item
                deferred.resolve(billingitem);
            }, 100);

            return deferred.promise;
        }

        function delete_(billingitem) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.billingitems.map(function(c) { return c.code; }).indexOf(billingitem.code);
                if(idx != -1) {
                    service.billingitems.splice(idx, 1);
                    deferred.resolve(billingitem);
                } else {
                    deferred.reject(new Error('There is no such billingitem'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
