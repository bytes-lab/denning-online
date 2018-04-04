materialAdmin
  // =========================================================================
  // Folders
  // =========================================================================
  
  .service('folderService', function($http, Auth) {
    var service = {};

    service.contacts = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/party?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/contact/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    return service;
  })
