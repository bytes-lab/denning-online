denningOnline
// =========================================================================
// Cities / Postcodes
// =========================================================================
  
  .service('cityService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/Postcode', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/City/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/City', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.getCountryList = function (page, pagesize, keyword) {
      return http.GET('v1/table/cboCountry', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }
    
    return service;
  })
