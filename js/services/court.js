materialAdmin
  // =========================================================================
  // Courts
  // =========================================================================
  
  .service('courtService', function($q, $timeout, $http, Auth){
    var service = {};
    service.courts = null;
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.delete = delete_;
    service.headers = Auth.isAuthenticated();

    function getList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/courtDiary/court',
        headers: service.headers
      }).then(function(resp) {
        service.courts = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/courtDiary/court/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function save(court) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.courts.map(function(c) {return c.id; }).indexOf(court.id);
        if(idx != -1) {
          service.courts[idx] = court;
          deferred.resolve(court);
        } else {
          service.courts.push(court);
        }
        //deferred.reject(new Error('dd'));
      }, 100);

      return deferred.promise;
    }

    function delete_(court) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.courts.map(function(c) {return c.id; }).indexOf(court.id);
        if(idx != -1) {
          service.courts.splice(idx, 1);
          deferred.resolve(court);
        } else {
          deferred.reject(new Error('There is no such court'));
        }
      }, 100);

      return deferred.promise;
    }
    return service;
  })
