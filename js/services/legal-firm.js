denningOnline
  // =========================================================================
  // LEGAL FIRMS / SOLICITORS
  // =========================================================================
  
  .service('legalFirmService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/Solicitor', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/Lawyer', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    };

    service.getItem = function (code) {
      return http.GET('v1/table/Lawyer'+code).then(function (resp) {
        return resp.data;
      });
    }
    return service;
  })
