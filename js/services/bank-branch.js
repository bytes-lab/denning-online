materialAdmin
  // =========================================================================
  // Bank Branches
  // =========================================================================
  
  .service('bankBranchService', function($q, $timeout, $http, Auth) {
    var service = {};

    service.bankBranches = null;
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.delete = delete_;
    service.headers = Auth.isAuthenticated();

    function getList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/bank/Branch',
        headers: service.headers
      }).then(function(resp) {
        service.bankBranches = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/bank/branch/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function save(contact) {
      var method = contact.code ? 'PUT': 'POST';
      delete contact.relatedMatter;
      contact.title = contact.title.description;
      // contact.irdBranch = contact.irdBranch.description;

      console.log(contact);

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/bank/Branch',
        headers: service.headers,
        data: contact
      }).then(function(response) {
        return response.data;
      });
    }

    function delete_(contact) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.bankBranches.map(function(c) { return c.code; }).indexOf(contact.code);
        if(idx != -1) {
          service.bankBranches.splice(idx, 1);
          deferred.resolve(contact);
        } else {
          deferred.reject(new Error('There is no such bank branch'));
        }
        // @@ send delete request to server to delete the item
      }, 100);

      return deferred.promise;
    }
    return service;
  })
