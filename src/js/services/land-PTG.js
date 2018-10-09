denningOnline
  // =========================================================================
  // Land PTGs
  // =========================================================================
  
  .service('landPTGService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/app/GovOffice/PTG', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/app/GovOffice/PTG/'+code).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
