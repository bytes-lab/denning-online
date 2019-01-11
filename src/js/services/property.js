denningOnline
  .service('propertyService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/property', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getFormatList = function (page, pagesize, keyword) {
      return http.GET('v1/table/PropertyFormat', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/property', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    };

    service.getItem = function (code) {
      return http.GET('v1/table/property/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/Property', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/property', { code: entity.code }).then(function (resp) {
        return resp;
      });
    }

    service.getTypeList = function (type) {
      return http.GET('v1/Property/'+type).then(function (resp) {
        return resp.data;
      });
    }

    service.getApprovingAuthorityList = function () {
      return http.GET('v1/generalSelection/frmProperty/ApprovingAuthority').then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
