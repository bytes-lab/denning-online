denningOnline
  // =========================================================================
  // Preset Billing Items
  // =========================================================================
  
  .service('presetbillService', function(http) {
    var service = {};

    service.getList = function (page, pagesize) {
      return http.GET('v1/PresetBill', {
        page: page,
        pagesize: pagesize})
      .then(function (resp) {
        return resp.data;
      });
    }

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('v1/table/PresetBill', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET(`v1/PresetBill/${code}`).then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
