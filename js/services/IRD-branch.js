materialAdmin
  // =========================================================================
  // IRB Branches
  // =========================================================================
  
  .service('IRDBranchService', function($q, $timeout, $http, Auth){
  var service = {};

  service.IRDBranches = null;
  service.getList = getList;
  service.getItem = getItem;
  service.save = save;
  service.delete = delete_;
  service.headers = Auth.isAuthenticated();

  function getList() {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/IRDBranch',
      headers: service.headers
    }).then(function(resp) {
      service.IRDBranches = resp.data;
      return resp.data;
    });  
  }

  function getItem(code) {
    return $http({
      method: 'GET',
      url: 'http://43.252.215.81/denningwcf/v1/IRDBranch/'+code,
      headers: service.headers
    }).then(function(resp) {
      return resp.data;
    });  
  }

  function save(IRDBranch) {
    var deferred = $q.defer();

    $timeout(function(){
    var idx = service.IRDBranches.map(function(c) {return c.id; }).indexOf(IRDBranch.id);
    if(idx != -1) {
      service.IRDBranches[idx] = IRDBranch;
      deferred.resolve(IRDBranch);
    } else {
      service.IRDBranches.push(IRDBranch);
    }
    //deferred.reject(new Error('dd'));
    }, 100);

    return deferred.promise;
  }

  function delete_(IRDBranch) {
    var deferred = $q.defer();

    $timeout(function(){
    var idx = service.IRDBranches.map(function(c) {return c.id; }).indexOf(IRDBranch.id);
    if(idx != -1) {
      service.IRDBranches.splice(idx, 1);
      deferred.resolve(IRDBranch);
    } else {
      deferred.reject(new Error('There is no such IRDBranch'));
    }
    }, 100);

    return deferred.promise;
  }
  return service;
  
  })
