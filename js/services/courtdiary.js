materialAdmin
  // =========================================================================
  // Court Diaries
  // =========================================================================
  
  .service('courtdiaryService', function($q, $timeout, $http, Auth) {
    var service = {};

    service.getList = function (page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/courtdiary?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    }

    service.getItem = function (code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/courtdiary/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/table/courtdiary',
        headers: Auth.isAuthenticated(),
        data: entity
      }).then(function(response) {
        return response.data;
      });
    }

    return service;
  })
