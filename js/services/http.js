denningOnline
  // =========================================================================
  // $http wrapper with refactoring model
  // =========================================================================
  
  .service('http', function($http, Auth, refactorService) {
    var service = {};

    service.GET = function (url, params, responseType) {
      return $http({
        method: 'GET',
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        params: params,
        responseType: responseType
      }).then(function (response) {
        return response;
      })
    };

    function do_(method, url, data) {
      return $http({
        method: method,
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        data: refactorService.removeEmpty(data)
      }).then(function (response) {
        return response;
      }).catch(function (err) {
        alert('Error: '+err.statusText);
      })
    }
    
    service.POST = function (url, data) {
      return do_('POST', url, data);
    };

    service.PUT = function (url, data) {
      return do_('PUT', url, data);
    };

    service.DELETE = function (url, data={}) {
      return do_('DELETE', url, data);
    };

    return service;
  })
