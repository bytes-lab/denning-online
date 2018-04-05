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

    function getList(code, type) {
      var url = 'http://43.252.215.81/denningwcf/v1/app/';
      if (type == 'contact') {
        url = url + 'contactFolder/'+code;
      } else {
        url = url + 'matter/'+code+'/fileFolder';
      }

      return $http({
        method: 'GET',
        url: url,
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp.data;
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