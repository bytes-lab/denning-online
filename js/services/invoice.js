denningOnline
  .service('invoiceService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('/v1/TaxInvoiceX/all', {
        page: page,
        pagesize: pagesize,
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
