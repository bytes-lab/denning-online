materialAdmin
  // =========================================================================
  // Billing Items
  // =========================================================================
  
  .service('quotationService', function(Auth, $http) {
    var service = {};

    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page=1, pagesize=25, keyword) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/QuotationX/all?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: service.headers
      }).then(function(resp) {
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/bank/branch/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    return service;    
  })
