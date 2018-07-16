denningOnline
  // =========================================================================
  // Folders
  // =========================================================================
  
  .service('folderService', function(http) {
    var service = {};
    
    service.getList = function (code, type) {
      var url = '/v1/app/';
      if (type == 'contact') {
        url = url + 'contactFolder/'+code;
      } else if (type == 'matter') {
        url = url + 'matter/'+code+'/fileFolder';
      }

      return http.GET(url).then(function(resp) {
        return resp.data;
      });
    }

    service.download = function (url) {
      return http.GET('/'+url, {}, 'arraybuffer').then(function(resp) {
        return resp;
      });
    }

    return service;
  })
