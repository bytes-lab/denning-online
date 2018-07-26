denningOnline
  // =========================================================================
  // occupations
  // =========================================================================
  
  .service('occupationService', function ($http, Auth) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/occupation?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    };

    service.getItem = function (code) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/app/GovOffice/PTG/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });    
    };

    return service;
  })
