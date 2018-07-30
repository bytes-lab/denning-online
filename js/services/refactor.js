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
    
    service.getDiff = function (model1, model2) {
      if (!model1) {
        return model2;
      } else {
        var model = { code: model1.code };
        for (ii in model1) {
          if (model1[ii] != model2[ii]) {
            model[ii] = model2[ii];
          }
        }
        return model;        
      }
    }

    return service;
  })
