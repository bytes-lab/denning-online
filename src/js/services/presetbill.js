denningOnline
  // =========================================================================
  // Preset Bills
  // =========================================================================
  
  .service('presetbillService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/PresetBill', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
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
      return http.GET('v1/table/PresetBill/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity, isUpdate) {
      var method = isUpdate ? 'PUT': 'POST';

      return http[method]('v1/table/PresetBill', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })
