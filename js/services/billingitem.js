denningOnline
  .service('billingitemService', function(http) {
    var service = {};

    service.getList = function (type, page, pagesize, keyword, state, category) {
      return http.GET(`v1/table/billitem/${type}`, {
        page: page,
        pagesize: pagesize,
        search: keyword,
        state: state,
        category: category
      }).then(function (resp) {
        return resp;
      });
    }

    service.getStateList = function () {
      return http.GET('v1/table/cboState').then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET(`v1/table/BillItem/${code}`).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/BillItem', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
  