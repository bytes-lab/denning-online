materialAdmin
  // =========================================================================
  // Contacts
  // =========================================================================
  
  .service('contactService', function($q, $timeout, $http, Auth) {
    var service = {};

    service.getList = function (page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/party?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    }

    service.getStaffList = function (page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/Staff?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    };

    service.getCustomerList = function (page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/Customer?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });  
    };

    service.getItem = function (code) {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/Customer/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    service.getIDTypeList = function () {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/table/IDType',
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    service.getSalutationList = function () {
      return $http({
        method: 'GET',
        url: 'https://43.252.215.81/denningwcf/v1/Salutation',
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    service.upload = function (info, type) {
      var url = 'https://43.252.215.81/denningwcf/v1/app/';
      if (type == 'contact') {
        url = url + 'contactFolder';
      } else {
        url = url + 'matter/fileFolder';
      }

      return $http({
        method: 'POST',
        url: url,
        headers: Auth.isAuthenticated(),
        data: info
      }).then(function(resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;

      return $http({
        method: method,
        url: 'https://43.252.215.81/denningwcf/v1/table/Customer',
        headers: Auth.isAuthenticated(),
        data: entity
      }).then(function(response) {
        return response.data;
      });
    }

    service.delete = function (contact) {
      var deferred = $q.defer();

      $timeout(function(){
        var idx = service.contacts.map(function(c) { return c.code; }).indexOf(contact.code);
        if(idx != -1) {
          service.contacts.splice(idx, 1);
          deferred.resolve(contact);
        } else {
          deferred.reject(new Error('There is no such contact'));
        }
        // @@ send delete request to server to delete the item
      }, 100);

      return deferred.promise;
    }
    return service;
  })
