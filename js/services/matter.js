materialAdmin
  // =========================================================================
  // File Matter, Matter Code
  // =========================================================================
  
  .service('fileMatterService', function($q, $timeout, $http, Auth) {
    var service = {};

    service.contacts = null;
    service.getList = getList;
    service.getItem = getItem;
    service.getIDTypeList = getIDTypeList;
    service.getSalutationList = getSalutationList;
    service.getIRDBranchList = getIRDBranchList;
    service.save = save;
    service.delete = delete_;
    service.headers = Auth.isAuthenticated();

    function getList(page, pagesize, keyword) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/party?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/contact/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getIDTypeList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/IDType',
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getSalutationList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Salutation',
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getIRDBranchList() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/IRDBranch',
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
        url: 'http://43.252.215.81/denningwcf/v1/app/contact',
        headers: service.headers,
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

  .service('matterCodeService', function($http, Auth){
    var service = {};
    service.landPTGs = null;
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page, pagesize) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/matter?type=all&page='+page+'&pagesize='+pagesize,
        headers: service.headers
      }).then(function(resp) {
        service.contacts = resp.data;
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/GovOffice/PTG/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });    
    }

    return service;
  })
