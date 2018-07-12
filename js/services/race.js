denningOnline
  .service('raceService', function ($http, Auth) {
    var service = {};

    service.getList = function (page=1, pagesize=10, keyword='') {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/Race?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    };

    service.getItem = function (code) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/Race/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });    
    };

    return service;
  })
