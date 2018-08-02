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
    
    function compare(fieldOriginal, fieldNew) {
      if (typeof(fieldNew) == 'object') {
        for (var ii in fieldNew) {
          if (fieldOriginal[ii] != fieldNew[ii]) {
            return false;
          }
        }
        return true;
      } else {
        return fieldOriginal == fieldNew;
      }
    }

    service.getDiff = function (modelOriginal, modelNew) {
      if (!modelOriginal) {
        return modelNew;
      } else {
        var model = { code: modelOriginal.code };
        for (var ii in modelNew) {
          flag = compare(modelOriginal[ii], modelNew[ii]);
          if (!flag) {
            model[ii] = modelNew[ii];
          }
        }
        return model;
      }
    }

    service.convertBool = function (model, toBool) {
      for (var ii in model) {
        if (ii.startsWith('bool')) {
          if (toBool) {
            model[ii] = model[ii] == "1" ? true: false;
          } else {
            model[ii] = model[ii] ? "1": "0";
          }
        }
      }
      return model;
    }

    return service;
  })
