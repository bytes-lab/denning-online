denningOnline
  // =========================================================================
  // LAND OFFICE
  // =========================================================================
  
  .service('landOfficeService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/app/GovOffice/LandOffice', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/app/GovOffice/LandOffice/'+code).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
