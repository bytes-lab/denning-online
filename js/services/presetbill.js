materialAdmin
    // =========================================================================
    // Billing Items
    // =========================================================================
    
    .service('presetbillService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.presetbills = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.presetbills) {
                var deferred = $q.defer();
                deferred.resolve(service.presetbills);
                return deferred.promise;
            } else {
                return $http.get('data/presetbills.json')
                .then(function(resp){
                    service.presetbills = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.presetbills) {
                var deferred = $q.defer();
                var item = service.presetbills.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.presetbills.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(presetbill) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.presetbills.map(function(c) { return c.code; }).indexOf(presetbill.code);
                if(idx != -1) {
                    service.presetbills[idx] = presetbill;
                } else {
                    // should be done on server side
                    presetbill.code = Math.floor(Math.random() * 1000 + 1);
                    service.presetbills.push(presetbill);
                }

                // @@ send post request to server to save the item
                deferred.resolve(presetbill);
            }, 100);

            return deferred.promise;
        }

        function delete_(presetbill) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.presetbills.map(function(c) { return c.code; }).indexOf(presetbill.code);
                if(idx != -1) {
                    service.presetbills.splice(idx, 1);
                    deferred.resolve(presetbill);
                } else {
                    deferred.reject(new Error('There is no such presetbill'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
