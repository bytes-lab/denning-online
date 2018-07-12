denningOnline
  // =========================================================================
  // Banks
  // =========================================================================
  
  .service('bankService', function($http, Auth) {
    var service = {};

    service.getTableList = function  (page, pagesize, keyword) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/BankCode?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    }

    service.getItem = function (code) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/BankCode/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }
    return service;    
  })
