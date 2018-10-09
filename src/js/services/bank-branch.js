denningOnline
  // =========================================================================
  // Bank Branches
  // =========================================================================
  
  .service('bankBranchService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/bank/Branch', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/BankBranchCode', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/BankBranchCode/'+code).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
