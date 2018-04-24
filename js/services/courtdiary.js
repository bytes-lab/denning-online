materialAdmin
  // =========================================================================
  // Court Diaries
  // =========================================================================
  
  .service('courtdiaryService', function($q, $timeout, $http, Auth) {
    var service = {};

    service.courtdiarys = null;
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.delete = delete_;

    function getList(start, end, page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/DenningCalendar?dateStart='+start+'&dateEnd='+end+'&filterBy=0All&page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        service.properties = resp.data;
        return resp;
      });  
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
    
  })
