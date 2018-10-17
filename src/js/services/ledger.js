denningOnline
  .service('ledgerService', function (http) {
    var service = {};

    service.getList = function (fileNo, category) {
      return http.GET('v1/'+fileNo+'/fileLedger/'+category).then(function (resp) {
        return resp.data;
      });
    }

    service.getSummary = function (fileNo) {
      return http.GET('v1/'+fileNo+'/fileLedger').then(function (resp) {
        return resp.data;
      });
    }

    function getItem(code) {
      return http('v1/app/GovOffice/PTG/'+code).then(function(resp) {
        return resp.data;
      });
    }

    return service;
  })
