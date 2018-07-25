denningOnline
  // =========================================================================
  // DOC TEMPLATE
  // =========================================================================
  
  .service('templateService', function(http) {
    var service = {};

    service.getCategories = function () {
      return http.GET('v1/table/cbotemplatecategory/only').then(function (resp) {
        return resp.data;
      });
    }

    service.getTypes = function (category) {
      return http.GET('v1/table/cbotemplatecategory', {
        filter: category
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getTemplates = function (category, type, source, fileno='2000-1077') {
      return http.GET('v1/table/cboTemplate', {
        fileno: fileno,
        Online: source.toLowerCase(),
        category: category,
        type: type
      }).then(function (resp) {
        return resp;
      });
    }

    return service;    
  })

