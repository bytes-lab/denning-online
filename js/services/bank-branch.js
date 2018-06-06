materialAdmin
  // =========================================================================
  // Bank Branches
  // =========================================================================
  
  .service('bankBranchService', function($http, Auth) {
    var service = {};

    service.bankBranches = null;
    service.getList = getList;
    service.getItem = getItem;

    function getList(page, pagesize, keyword) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/bank/Branch?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        service.bankBranches = resp.data;
        return resp;
      });  
    }

    service.getTableList = function  (page, pagesize, keyword) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/BankBranchCode?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/BankBranchCode/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }
    return service;
  })
