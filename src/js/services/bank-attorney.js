denningOnline
  // =========================================================================
  // Bank Attorney
  // =========================================================================
  
  .service('bankAttorneyService', function(http) {
    var service = {};

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/attorney', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/attorney/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/attorney', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
