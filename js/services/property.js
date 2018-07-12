denningOnline
  // =========================================================================
  // Properties
  // =========================================================================
  
  .service('propertyService', function(http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('/v1/property?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });  
    }

    service.getTableList = function (page, pagesize, keyword) {
      return http.GET('/v1/table/property?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });  
    };

    service.getItem = function (code) {
      return http.GET('/v1/table/property/'+code).then(function(resp) {
        return resp.data;
      });  
    }

    service.save = function (entity) {
      if (entity.code) {
        return http.PUT('/v1/table/Property', entity).then(function(response) {
          return response ? response.data : null;
        });        
      } else {
        return http.POST('/v1/table/Property', entity).then(function(response) {
          return response ? response.data : null;
        });                
      }
    }

    service.delete = function (property) {      
    }

    service.getTypeList = function (type) {
      return http.GET('/v1/Property/'+type).then(function(resp) {
        return resp.data;
      });  
    }

    return service;
  })
