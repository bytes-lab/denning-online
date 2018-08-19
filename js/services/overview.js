denningOnline
  // =========================================================================
  // Overview
  // =========================================================================
  
  .service('overviewService', function(http) {
    var service = {};

    service.getOverview = function () {
      return http.GET('v1/WebOverView').then(function (resp) {
        return resp.data;
      });
    }

    service.getWidget = function (url) {
      return http.GET(url).then(function (resp) {
        return resp.data;
      });
    }

    service.getWidgetList = function () {
      return http.GET('v1/WebOverView/Widget').then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      return http.PUT('v1/WebOverView', entity).then(function (resp) {
        return resp.data;
      });
    }
    
    return service;
  })
