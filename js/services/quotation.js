denningOnline
  .service('quotationService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('/v1/QuotationX/all', {
        page: page || 1,
        pagesize: pagesize || 25,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('/v1/app/bank/branch/'+code).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
