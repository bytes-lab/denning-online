denningOnline
  .service('quotationService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/Quotation', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET(`v1/Quotation/${code}`).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
