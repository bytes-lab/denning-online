denningOnline
  // =========================================================================
  // Bank Branches
  // =========================================================================
  
  .service('trialBalanceService', function(http) {
    var service = {};

    service.getList = function (category, page, pagesize, keyword) {
      return http.GET('v1/trialBalance/'+category, {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/trialBalance/'+code).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
