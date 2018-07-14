denningOnline
  // =========================================================================
  // Court Diaries
  // =========================================================================
  
  .service('courtdiaryService', function(http) {
    var service = {};

    service.getList = function (page=1, pagesize=25, keyword='') {
      return http.GET('/v1/table/courtdiary?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });
    }

    service.getCalendar = function (page=1, pagesize=25, keyword='') {
      return http.GET("/v1/DenningCalendar?dateStart='2014-04-01'&dateEnd='2014-04-30'&filterBy=0All").then(function(resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('/v1/table/courtdiary/'+code).then(function(resp) {
        return resp;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('/v1/table/courtdiary', entity).then(function(response) {
        return response ? response.data : null;
      });
    }

    return service;
  })
