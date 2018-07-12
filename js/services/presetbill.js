denningOnline
  // =========================================================================
  // Preset Billing Items
  // =========================================================================
  
  .service('presetbillService', function($http, Auth) {
    var service = {};

    service.getList = getList;
    service.getItem = getItem;

    function getList(page, pagesize) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/PresetBill?page='+page+'&pagesize='+pagesize,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });
    }

    service.getTableList = function (page, pagesize, keyword='') {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/PresetBill?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/PresetBill/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    return service;
  })
