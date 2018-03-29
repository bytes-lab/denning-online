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

  function getList(page=1, pagesize=20) {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/IRDBranch?page='+page+'&pagesize='+pagesize,
      headers: service.headers
    }).then(function(resp) {
      return resp.data;
    });
  }

  function getItem(code) {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/IRDBranch/'+code,
      headers: service.headers
    }).then(function(resp) {
      return resp.data;
    });
  }
  return service;
})
