denningOnline
  // =========================================================================
  // $http wrapper with refactoring model
  // =========================================================================
  
  .service('http', function($http, $uibModal, Auth, refactorService) {
    var service = {
      openSessionDialog: false
    };

    service.GET = function (url, params, responseType) {
      return $http({
        method: 'GET',
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        params: params,
        responseType: responseType
      }).then(function (response) {
        return response;
      }).catch(function (err) {
        if (err.status == 408) {
          // ensure open only once
          if (!service.openSessionDialog) {
            service.openSessionDialog = true;

            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'loginModal.html',
              controller: 'loginCtrl as lctrl',
              size: '',
              backdrop: 'static',
              keyboard: true,
              windowClass: 'login-modal',
              resolve: {
                dialogTitle: function () {
                  return err.statusText;
                }
              }
            });
          }
        } else {
          alert('Error: '+err.statusText);
        }
      })
    };

    function do_(method, url, data) {
      return $http({
        method: method,
        url: Auth.getBaseURL() + url,
        headers: Auth.isAuthenticated(),
        data: refactorService.preConvert(data, false)
      }).then(function (response) {
        return response;
      }).catch(function (err) {
        alert('Error: ' + err.statusText);
      })
    }
    
    service.POST = function (url, data) {
      return do_('POST', url, data);
      // return do_('POST', url, refactorService.removeEmpty(data));
    };

    service.PUT = function (url, data) {
      return do_('PUT', url, data);
    };

    service.DELETE = function (url, data) {
      return do_('DELETE', url, data);
    };

    return service;
  })
