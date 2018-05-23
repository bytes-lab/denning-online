materialAdmin
  // =========================================================================
  // Contacts
  // =========================================================================
  
  .service('contactService', function($q, $timeout, $http, Auth) {
    var service = {};

    service.contacts = null;
    service.getList = getList;
    service.getItem = getItem;
    service.getIDTypeList = getIDTypeList;
    service.getSalutationList = getSalutationList;
    service.getIRDBranchList = getIRDBranchList;
    service.save = save;
    service.upload = upload;
    service.delete = delete_;

    function getList(page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/Customer?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/contact/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getIDTypeList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/IDType',
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getSalutationList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Salutation',
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getIRDBranchList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/IRDBranch',
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });
    }

    function upload(info, type) {
      var url = 'http://43.252.215.81/denningwcf/v1/app/';
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

    function save(contact) {
      var method = contact.code ? 'PUT': 'POST';
      delete contact.relatedMatter;
      // contact.irdBranch = contact.irdBranch.description;

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/app/contact',
        headers: Auth.isAuthenticated(),
        data: contact
      }).then(function(response) {
        return response.data;
      });
    }

    function delete_(contact) {
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
