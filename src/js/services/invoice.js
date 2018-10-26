denningOnline
  .service('invoiceService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/table/bill', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getNote = function (code, type) {
      return http.GET('v1/table/bill'+type+'Note?search='+code).then(function (resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/bill/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/bill', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
