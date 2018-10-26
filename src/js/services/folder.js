denningOnline
  .service('folderService', function(http) {
    var service = {};
    
    service.getList = function (code, type) {
      return http.GET('v1/document/'+type+'/dir/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.download = function (url) {
      return http.GET(url, {}, 'arraybuffer').then(function(resp) {
        return resp;
      });
    }

    service.getLink = function (url) {
      return http.GET(url).then(function (resp) {
        return resp.data;
      });
    }

    service.renameDocument = function (url, data) {
      return http.PUT(url, data).then(function (resp) {
        return resp;
      });
    }

    service.createSubFolder = function (data) {
      return http.POST('v1/document/matter/subFolder', data).then(function (resp) {
        return resp;
      });
    }

    service.moveDocument = function (data) {
      return http.PUT('v1/document/matter/move', data).then(function (resp) {
        return resp;
      });
    }

    service.copyDocument = function (data) {
      return http.PUT('v1/document/matter/copy', data).then(function (resp) {
        return resp;
      });
    }

    service.deleteDocument = function (url) {
      return http.DELETE(url).then(function (resp) {
        return resp;
      });
    }

    service.getShares = function(url) {
      url = url.replace('document/matter', 'table/SharedDocument');
      return http.GET(url).then(function (resp) {
        return resp.data;
      });      
    }

    service.share = function(url, data) {
      url = url.replace('document/matter', 'table/SharedDocument');
      return http.PUT(url, data).then(function (resp) {
        return resp;
      });      
    }

    return service;
  })
