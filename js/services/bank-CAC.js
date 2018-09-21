denningOnline
  // =========================================================================
  // Bank CACs
  // =========================================================================
  
  .service('bankCACService', function(http) {
    var service = {};

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/BankCACCode', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET(`v1/table/BankCACCode/${code}`).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
