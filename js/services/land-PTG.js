materialAdmin
  // =========================================================================
  // Land PTGs
  // =========================================================================
  
  .service('landPTGService', function($http, Auth){
    var service = {};
    service.landPTGs = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page, pagesize) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/PTG?page='+page+'&pagesize='+pagesize,
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/PTG/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });    
    }

    return service;
  })
