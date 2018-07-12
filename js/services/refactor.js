denningOnline
  // =========================================================================
  // Refactor models when save or update
  // =========================================================================
  
  .service('refactorService', function() {
    var service = {};

    service.removeEmpty = function (model) {
      angular.forEach(model, function(value, key) {
        if (!value || value.code !== undefined && !value.code) {
          delete model[key];
        }
      })
      return model;
    }
    
    return service;
  })
