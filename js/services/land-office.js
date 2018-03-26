materialAdmin
  // =========================================================================
  // LAND OFFICE
  // =========================================================================
  
  .service('landOfficeService', function($q, $timeout, $http, Auth) {
    var service = {};
    service.landOffices = null;
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.delete = delete_;
    service.headers = Auth.isAuthenticated();

    function getList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/LandOffice',
        headers: service.headers
      }).then(function(resp) {
        service.landOffices = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/LandOffice/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function save(landOffice) {
      var method = landOffice.code ? 'PUT': 'POST';
      delete landOffice.relatedMatter;

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/LandOffice',
        headers: service.headers,
        data: landOffice
      }).then(function(response) {
        return response.data;
      });
    }

    function delete_(landOffice) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.landOffices.map(function(c) {return c.id; }).indexOf(landOffice.id);
        if(idx != -1) {
          service.landOffices.splice(idx, 1);
          deferred.resolve(landOffice);
        } else {
          deferred.reject(new Error('There is no such landOffice'));
        }
      }, 100);

      return deferred.promise;
    }
    return service;
  })
