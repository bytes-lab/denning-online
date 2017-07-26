materialAdmin
    // =========================================================================
    // LEGAL FIRMS
    // =========================================================================
    
    .service('legalFirmService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
        var service = {};

        function getList() {
            return $http.get('data/legal-firms.json')
            .then(function(resp){
                return resp.data;
            })
        }

        service.legalFirms = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.legalFirms) {
                    service.legalFirms = fakedata;
                }
                
                var item = service.legalFirms.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
            }, 100);

            return deferred.promise;
        }

        function save(legalFirm) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.legalFirms.map(function(c) {return c.id; }).indexOf(legalFirm.id);
                if(idx != -1) {
                    service.legalFirms[idx] = legalFirm;
                    deferred.resolve(legalFirm);
                } else {
                    service.legalFirms.push(legalFirm);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(legalFirm) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.legalFirms.map(function(c) {return c.id; }).indexOf(legalFirm.id);
                if(idx != -1) {
                    service.legalFirms.splice(idx, 1);
                    deferred.resolve(legalFirm);
                } else {
                    defered.reject(new Error('There is no such legal firm'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
