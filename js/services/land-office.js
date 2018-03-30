materialAdmin
  // =========================================================================
  // LAND OFFICE
  // =========================================================================
  
  .service('landOfficeService', function($q, $timeout, $http, Auth) {
    var service = {};
    service.landOffices = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page, pagesize) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/LandOffice?page='+page+'&pagesize='+pagesize,
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
    return service;
  })
