materialAdmin
    // =========================================================================
    // Billing Items
    // =========================================================================
    
    .service('invoiceService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.invoices = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.invoices) {
                var deferred = $q.defer();
                deferred.resolve(service.invoices);
                return deferred.promise;
            } else {
                return $http.get('data/invoices.json')
                .then(function(resp){
                    service.invoices = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.invoices) {
                var deferred = $q.defer();
                var item = service.invoices.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.invoices.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(invoice) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.invoices.map(function(c) { return c.code; }).indexOf(invoice.code);
                if(idx != -1) {
                    service.invoices[idx] = invoice;
                } else {
                    // should be done on server side
                    invoice.code = Math.floor(Math.random() * 1000 + 1);
                    service.invoices.push(invoice);
                }

                // @@ send post request to server to save the item
                deferred.resolve(invoice);
            }, 100);

            return deferred.promise;
        }

        function delete_(invoice) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.invoices.map(function(c) { return c.code; }).indexOf(invoice.code);
                if(idx != -1) {
                    service.invoices.splice(idx, 1);
                    deferred.resolve(invoice);
                } else {
                    defered.reject(new Error('There is no such invoice'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
