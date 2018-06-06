materialAdmin
  // =========================================================================
  // File Matter, Matter Code, Matter Form
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

    function getList(page=1, pagesize=25, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/generalSearch/file?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: service.headers
      }).then(function(resp) {
        return resp;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/File/'+code,
        // url: 'http://43.252.215.81/denningwcf/v1/app/matter/'+code,
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
    service.getList = getList;
    service.getItem = getItem;
    service.headers = Auth.isAuthenticated();

    function getList(page=1, pagesize=500) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/MatterCode?page='+page+'&pagesize='+pagesize,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/MatterCode/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });    
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;

      console.log(entity);

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/table/MatterCode',
        headers: Auth.isAuthenticated(),
        data: entity
      }).then(function(response) {
        return response.data;
      });
    }

    return service;
  })

  .service('matterFormService', function($http, Auth){
    var service = {};
    service.getList = getList;
    service.getItem = getItem;

    function getList(page=1, pagesize=500, keyword='') {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/MatterCodeEditForm?page='+page+'&pagesize='+pagesize+'&search='+keyword,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/MatterCodeEditForm/'+code,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });    
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;
      delete entity.intCategory;
      delete entity.intOrdering;

      if (!entity.code || entity.code.length == 0) {
        entity.code = 'frmFile' + entity.strDisplayName.replace(' ', '');
      }

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/table/MatterCodeEditForm',
        headers: Auth.isAuthenticated(),
        data: entity
      }).then(function(response) {
        return response.data;
      });
    }

    return service;
  })
