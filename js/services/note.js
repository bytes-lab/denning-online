materialAdmin
  // =========================================================================
  // Notes
  // =========================================================================
  
  .service('noteService', function($http, Auth){
    var service = {};
    service.landPTGs = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(fileNo, page, pagesize) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/Note?fileNo='+fileNo+'&page='+page+'&pagesize='+pagesize,
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/Note/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });    
    }

    return service;
  })
