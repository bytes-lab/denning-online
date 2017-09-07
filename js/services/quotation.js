materialAdmin
    // =========================================================================
    // Billing Items
    // =========================================================================
    
    .service('quotationService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.quotations = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.quotations) {
                var deferred = $q.defer();
                deferred.resolve(service.quotations);
                return deferred.promise;
            } else {
                return $http.get('data/quotations.json')
                .then(function(resp){
                    service.quotations = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.quotations) {
                var deferred = $q.defer();
                var item = service.quotations.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.quotations.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(quotation) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.quotations.map(function(c) { return c.code; }).indexOf(quotation.code);
                if(idx != -1) {
                    service.quotations[idx] = quotation;
                } else {
                    // should be done on server side
                    quotation.code = Math.floor(Math.random() * 1000 + 1);
                    service.quotations.push(quotation);
                }

                // @@ send post request to server to save the item
                deferred.resolve(quotation);
            }, 100);

            return deferred.promise;
        }

        function delete_(quotation) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.quotations.map(function(c) { return c.code; }).indexOf(quotation.code);
                if(idx != -1) {
                    service.quotations.splice(idx, 1);
                    deferred.resolve(quotation);
                } else {
                    deferred.reject(new Error('There is no such quotation'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
