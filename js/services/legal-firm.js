materialAdmin
  // =========================================================================
  // LEGAL FIRMS
  // =========================================================================
  
  .service('legalFirmService', function($q, $timeout, $http, Auth){
    var service = {};

    service.legalFirms = null;
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.delete = delete_;
    service.headers = Auth.isAuthenticated();
    console.log(service.headers);
    
    function getList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Solicitor',
        headers: service.headers
      }).then(function(resp) {
        service.properties = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/Solicitor/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });
    }

    function save(legalFirm) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.legalFirms.map(function(c) {return c.code; }).indexOf(legalFirm.code);
        if(idx != -1) {
          service.legalFirms[idx] = legalFirm;
        } else {
          service.legalFirms.push(legalFirm);
        }
        deferred.resolve(legalFirm);
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
    
  })
