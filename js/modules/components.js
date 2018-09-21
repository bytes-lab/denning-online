denningOnline

  .directive('camelCase', function() {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      link: function(scope, element, attrs) {
        var camel = function (text) {
          var words = text.split(' ');
          for (ii in words) {
            words[ii] = words[ii].slice(0,1).toUpperCase() + words[ii].slice(1);
          }
          return words.join(' ');
        };

        element.bind('blur', function() {
          if (scope.ngModel) {
            scope.ngModel = camel(scope.ngModel);
            scope.$apply();
          }
        });
      }
    }
  })

  //Make text camel case
  .directive('camelCaseTailComma', function() {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      link: function(scope, element, attrs) {
        var camel = function (text) {
          var words = text.split(' ');
          for (ii in words) {
            words[ii] = words[ii].slice(0,1).toUpperCase() + words[ii].slice(1);
          }
          return words.join(' ');
        };

        element.bind('blur', function() {
          if (scope.ngModel) {
            var model = camel(scope.ngModel).trim();
            model = model.slice(-1) != "," ? model+', ' : model+' ';
            scope.ngModel = model;
            scope.$apply();
          }
        });
      }
    }
  })
