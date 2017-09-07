materialAdmin
    // =========================================================================
    // LEGAL FIRMS
    // =========================================================================
    
    .service('legalFirmService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
        var service = {};

        function getList() {

            if (service.legalFirms) {
                var deferred = $q.defer();
                deferred.resolve(service.legalFirms);
                return deferred.promise;
            } else {
                return $http.get('data/legal-firms.json')
                .then(function(resp){
                    service.legalFirms = resp.data;                
                    return resp.data;
                })                
            }
        }

        service.legalFirms = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getItem(code) {
            if(service.legalFirms) {
                var deferred = $q.defer();

                $timeout(function(){
                    var item = service.legalFirms.filter(function(c){
                        return c.code == code;
                    });
                    if (item.length == 1)
                        deferred.resolve(item[0]);
                    else
                        deferred.reject(new Error('No Item with the code'));
                }, 100);
                return deferred.promise;

            } else {
                return getList().then(function(data){
                    var item = service.legalFirms.filter(function(c){
                        return c.code == code;
                    });
                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(legalFirm) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.legalFirms.map(function(c) {return c.code; }).indexOf(legalFirm.code);
                if(idx != -1) {
                    service.legalFirms[idx] = legalFirm;
                    deferred.resolve(legalFirm);
                } else {
                    service.legalFirms.push(legalFirm);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(legalFirm) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.legalFirms.map(function(c) {return c.code; }).indexOf(legalFirm.code);
                if(idx != -1) {
                    service.legalFirms.splice(idx, 1);
                    deferred.resolve(legalFirm);
                } else {
                    deferred.reject(new Error('There is no such legal firm'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
