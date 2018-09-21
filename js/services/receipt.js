denningOnline
    // =========================================================================
    // Billing Items
    // =========================================================================
    
    .service('receiptService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.receipts = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.receipts) {
                var deferred = $q.defer();
                deferred.resolve(service.receipts);
                return deferred.promise;
            } else {
                return $http.get('data/receipts.json')
                .then(function(resp){
                    service.receipts = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.receipts) {
                var deferred = $q.defer();
                var item = service.receipts.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.receipts.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(receipt) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.receipts.map(function(c) { return c.code; }).indexOf(receipt.code);
                if(idx != -1) {
                    service.receipts[idx] = receipt;
                } else {
                    // should be done on server side
                    receipt.code = Math.floor(Math.random() * 1000 + 1);
                    service.receipts.push(receipt);
                }

                // @@ send post request to server to save the item
                deferred.resolve(receipt);
            }, 100);

            return deferred.promise;
        }

        function delete_(receipt) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.receipts.map(function(c) { return c.code; }).indexOf(receipt.code);
                if(idx != -1) {
                    service.receipts.splice(idx, 1);
                    deferred.resolve(receipt);
                } else {
                    defered.reject(new Error('There is no such receipt'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
