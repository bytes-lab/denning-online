materialAdmin
    // =========================================================================
    // DOC TEMPLATE
    // =========================================================================
    
    .service('templateService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
        var service = {};

        function getList() {
            if (service.templates) {
                var deferred = $q.defer();
                deferred.resolve(service.templates);
                return deferred.promise;
            } else {
                return $http.get('data/cboTemplate-fileno=2000-1077-Online=all-category=Forms-Type=F01')
                .then(function(resp){
                    service.templates = resp.data;                
                    return resp.data;
                })                
            }
        }

        service.templates = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getItem(code) {
            if(service.templates) {
                var deferred = $q.defer();

                $timeout(function(){
                    var item = service.templates.filter(function(c){
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
                    var item = service.templates.filter(function(c){
                        return c.code == code;
                    });
                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(template) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.templates.map(function(c) {return c.code; }).indexOf(template.code);
                if(idx != -1) {
                    service.templates[idx] = template;
                    deferred.resolve(template);
                } else {
                    service.templates.push(template);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(template) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.templates.map(function(c) {return c.code; }).indexOf(template.code);
                if(idx != -1) {
                    service.templates.splice(idx, 1);
                    deferred.resolve(template);
                } else {
                    defered.reject(new Error('There is no such legal firm'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
