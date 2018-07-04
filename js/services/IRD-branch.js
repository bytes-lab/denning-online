materialAdmin
  // =========================================================================
  // IRB Branches
  // =========================================================================
  
.service('IRDBranchService', function(http){
  var service = {};

  service.getList = function (page=1, pagesize=20, search='') {
    return http.GET('/v1/IRDBranch?page='+page+'&pagesize='+pagesize+'&search='+search).then(function(resp) {
      return resp.data;
    });
  }

  service.getTableList = function (page=1, pagesize=20, search='') {
    return http.GET('/v1/table/IRDBranch?page='+page+'&pagesize='+pagesize+'&search='+search).then(function(resp) {
      return resp.data;
    });
  }

  service.getItem = function (code) {
    return http.GET('/v1/table/IRDBranch/'+code).then(function(resp) {
      return resp.data;
    });
  }
  return service;
})
