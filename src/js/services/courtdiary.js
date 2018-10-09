denningOnline
  // =========================================================================
  // Court Diaries
  // =========================================================================
  
  .service('courtdiaryService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/table/courtdiary', {
        page: page,
        pagesize: pagesize,
        search:keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getHearingTypeList = function (page, pagesize, keyword) {
      return http.GET('v1/courtDiary/hearingType', {
        page: page,
        pagesize: pagesize,
        search:keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getCoramList = function (page, pagesize, keyword) {
      return http.GET('v1/courtDiary/coram', {
        page: page,
        pagesize: pagesize,
        search:keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getCalendar = function (start, end, filter, page, pagesize, keyword) {
      return http.GET("v1/DenningCalendar", {
        dateStart: start,
        dateEnd: end,
        filterBy: filter,
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/courtdiary/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/courtdiary', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/courtdiary', { code: entity.code }).then(function (resp) {
        return resp;
      });
    }

    return service;
  })
