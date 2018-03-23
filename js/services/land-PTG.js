materialAdmin
  // =========================================================================
  // Land PTGs
  // =========================================================================
  
  .service('landPTGService', function($q, $timeout, $http, Auth){
    var service = {};
    service.landPTGs = null;
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.delete = delete_;
    service.headers = Auth.isAuthenticated();

    function getList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.163:8313/denningapi/v1/GovOffice/PTG',
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
        return $http({
            method: 'GET',
            url: 'http://43.252.215.163:8313/denningapi/v1/GovOffice/PTG/'+code,
            headers: service.headers
        }).then(function(resp) {
            return resp.data;
        });    
    }

    function save(landPTG) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.landPTGs.map(function(c) {return c.id; }).indexOf(landPTG.id);
        if(idx != -1) {
          service.landPTGs[idx] = landPTG;
          deferred.resolve(landPTG);
        } else {
          service.landPTGs.push(landPTG);
        }
        //deferred.reject(new Error('dd'));
      }, 100);

      return deferred.promise;
    }

    function delete_(landPTG) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.landPTGs.map(function(c) {return c.id; }).indexOf(landPTG.id);
        if(idx != -1) {
          service.landPTGs.splice(idx, 1);
          deferred.resolve(landPTG);
        } else {
          deferred.reject(new Error('There is no such landPTG'));
        }
      }, 100);

      return deferred.promise;
    }
    return service;
  })
