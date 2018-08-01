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
    
    service.getDiff = function (modelOriginal, modelNew) {
      if (!modelOriginal) {
        return modelNew;
      } else {
        var model = { code: modelOriginal.code };
        for (ii in modelOriginal) {
          if (modelOriginal[ii] != modelNew[ii]) {
            model[ii] = modelNew[ii];
          }
        }
        return model;        
      }
    }

    return service;
  })
