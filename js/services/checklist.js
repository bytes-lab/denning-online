denningOnline
  // =========================================================================
  // SPA Checklist
  // =========================================================================
  
  .service('spaChecklistService', function(http) {
    var service = {};

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/SPAChecklist', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET(`v1/table/SPAChecklist/${code}`).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
