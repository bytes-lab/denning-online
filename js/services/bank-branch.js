materialAdmin
  // =========================================================================
  // Bank Branches
  // =========================================================================
  
  .service('bankBranchService', function($http, Auth) {
    var service = {};

    service.bankBranches = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page, pagesize, keyword) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/bank/Branch?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: service.headers
      }).then(function(resp) {
        service.bankBranches = resp.data;
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/bank/branch/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }
    return service;
  })
