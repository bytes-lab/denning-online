materialAdmin
  // =========================================================================
  // DOC TEMPLATE
  // =========================================================================
  
  .service('templateService', function($http, Auth){
    var service = {};
    service.getCategories = getCategories;
    service.getTypes = getTypes;
    service.getTemplates = getTemplates;

    function getCategories() {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Table/cbotemplatecategory/only',
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });
    }

    function getTypes(category) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Table/cbotemplatecategory?filter='+category,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp.data;
      });
    }

    function getTemplates(category, type, source, fileNo) {
      if (!fileNo) {
        fileNo ='2000-1077';
      }
      
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/Table/cboTemplate?fileno='+fileNo+'&Online='+source.toLowerCase()+'&category='+category+'&Type='+type,
        headers: Auth.isAuthenticated()
      }).then(function(resp) {
        return resp;
      });
    }

    return service;    
  })
