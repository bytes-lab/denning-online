denningOnline
  // =========================================================================
  // $http wrapper with refactoring model
  // =========================================================================
  
  .service('http', function($http, Auth, refactorService) {
    var service = {};

    service.GET = function (url, params) {
      return $http({
        method: 'GET',
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        params: params
      }).then(function(response) {
        return response;
      })
    };

    service.POST = function (url, data) {
      return $http({
        method: 'POST',
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        data: refactorService.removeEmpty(data)
      }).then(function(response) {
        return response;
      }).catch(function (err) {
        alert('Error: '+err.statusText);
      })
    };

    service.PUT = function (url, data) {
      return $http({
        method: 'PUT',
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        data: refactorService.removeEmpty(data)
      }).then(function (response) {
        return response;
      }).catch(function (err) {
        alert('Error: '+err.statusText);
      })
    };

    return service;
  })
