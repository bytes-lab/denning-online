denningOnline
  .service('invoiceService', function (http) {
    var service = {};

    service.getList = function (page=1, pagesize=25, keyword) {
      return http.GET('/v1/TaxInvoiceX/outstanding', {
        page: page,
        pagesize: pagesize,
        fileno: keyword
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
