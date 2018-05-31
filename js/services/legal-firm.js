materialAdmin
  // =========================================================================
  // LEGAL FIRMS / SOLICITORS
  // =========================================================================
  
  .service('legalFirmService', function($http, Auth){
    var service = {};
    service.getList = getList;
    service.getItem = getItem;

    function getList(page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Solicitor?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    }

    service.getTableList = function (page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/Lawyer?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    };

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/Solicitor/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });
    }
    return service;
  })
