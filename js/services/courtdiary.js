materialAdmin
    // =========================================================================
    // Court Diaries
    // =========================================================================
    
    .service('courtdiaryService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
        var service = {};

        service.courtdiarys = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            if (service.courtdiarys) {
                var deferred = $q.defer();
                deferred.resolve(service.courtdiarys);
                return deferred.promise;
            } else {
                return $http.get('data/contacts.json')
                .then(function(resp){
                    service.courtdiarys = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getItem(code) {
            if(service.courtdiarys) {
                var deferred = $q.defer();
                var item = service.courtdiarys.filter(function(c) {
                    return c.code == code;
                });

                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.reject(new Error('No Item with the code'));

                return deferred.promise;
            } else {
                return getList().then(function(data) {
                    var item = service.courtdiarys.filter(function(c) {
                        return c.code == code;
                    });

                    if (item.length == 1)
                        return item[0];
                    else
                        throw new Error('No such item');
                });
            }
        }

        function save(courtdiary) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.courtdiarys.map(function(c) { return c.code; }).indexOf(courtdiary.code);
                if(idx != -1) {
                    service.courtdiarys[idx] = courtdiary;
                } else {
                    // should be done on server side
                    courtdiary.code = Math.floor(Math.random() * 1000 + 1);
                    service.courtdiarys.push(courtdiary);
                }

                // @@ send post request to server to save the item
                deferred.resolve(courtdiary);
            }, 100);

            return deferred.promise;
        }

        function delete_(courtdiary) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.courtdiarys.map(function(c) { return c.code; }).indexOf(courtdiary.code);
                if(idx != -1) {
                    service.courtdiarys.splice(idx, 1);
                    deferred.resolve(courtdiary);
                } else {
                    deferred.reject(new Error('There is no such courtdiary'));
                }
                // @@ send delete request to server to delete the item
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
