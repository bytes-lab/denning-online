denningOnline
  .service('receiptService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword, accType) {
      return http.GET('v1/ClientReceipt', {
        page: page,
        pagesize: pagesize,
        search: keyword,
        accType: accType
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/ClientReceipt/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/receipt', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
