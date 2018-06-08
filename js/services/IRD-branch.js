materialAdmin
  // =========================================================================
  // IRB Branches
  // =========================================================================
  
.service('IRDBranchService', function($http, Auth){
  var service = {
    getList: getList,
    getItem: getItem,
    headers: Auth.isAuthenticated()
  };

  function getList(page=1, pagesize=20, search='') {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/IRDBranch?page='+page+'&pagesize='+pagesize+'&search='+search,
      headers: service.headers
    }).then(function(resp) {
      return resp.data;
    });
  }

  function getTableList(page=1, pagesize=20, search='') {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/table/IRDBranch?page='+page+'&pagesize='+pagesize+'&search='+search,
      headers: service.headers
    }).then(function(resp) {
      return resp.data;
    });
  }

  function getItem(code) {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/table/IRDBranch/'+code,
      headers: service.headers
    }).then(function(resp) {
      return resp.data;
    });
  }
  return service;
})
