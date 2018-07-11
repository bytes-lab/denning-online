materialAdmin
  // =========================================================================
  // Overview
  // =========================================================================
  
  .service('overviewService', function(http) {
    var service = {};

    service.getWidget1 = function () {
      return http.GET('/v1/WebOverView/Type1/W001').then(function(resp) {
        return resp.data;
      });
    }

    service.getWidget2 = function () {
      return http.GET('/v1/WebOverView/Type2/W002').then(function(resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;

      if (entity.code) {
        return http.PUT('/v1/table/Customer', entity).then(function(response) {
          return response.data;
        });
      } else {
        return http.POST('/v1/table/Customer', entity).then(function(response) {
          return response.data;
        });
      }
    }
    
    return service;
  })
