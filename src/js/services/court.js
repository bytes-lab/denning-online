denningOnline
  .service('courtService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword, type) {
      return http.GET('v1/table/court', {
        page: page,
        pagesize: pagesize,
        search: keyword,
        type: type
      }).then(function (resp) {
        return resp;
      });
    }

    service.getTypeList = function (page, pagesize, keyword) {
      return http.GET('v1/table/courttype', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/court/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/court', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
