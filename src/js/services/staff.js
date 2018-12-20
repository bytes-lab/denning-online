denningOnline
  // =========================================================================
  // Staffs
  // =========================================================================
  
  .service('staffService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/table/Staff', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/Staff/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/Staff', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
