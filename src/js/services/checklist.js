denningOnline
  // =========================================================================
  // SPA Checklist
  // =========================================================================
  
  .service('spaChecklistService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/table/SPAPresetChecklist', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/SPAChecklist', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/SPAChecklist/'+code).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
