denningOnline
  // =========================================================================
  // $http wrapper
  // =========================================================================
  
  .service('http', function($http, Auth) {
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
        data: data
      }).then(function(response) {
        return response;
      })
    };

    service.PUT = function (url, data) {
      return $http({
        method: 'PUT',
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        data: data
      }).then(function(response) {
        return response;
      })
    };

    return service;
  })
