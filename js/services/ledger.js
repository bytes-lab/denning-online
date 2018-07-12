denningOnline
  // =========================================================================
  // Ledgers
  // =========================================================================
  
  .service('ledgerService', function($http, Auth){
    var service = {};
    service.landPTGs = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(fileNo, category) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/'+fileNo+'/fileLedger/'+category,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/app/GovOffice/PTG/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });    
    }

    return service;
  })
