denningOnline
  .service('buildingService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/table/BuildingCultivationType', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }


    service.getItem = function (code) {
      return http.GET('v1/table/BuildingCultivationType/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/BuildingCultivationType', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
