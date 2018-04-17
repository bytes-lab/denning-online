materialAdmin
  // =========================================================================
  // Notes
  // =========================================================================
  
  .service('noteService', function($http, Auth){
    var service = {};
    service.getList = getList;
    service.getItem = getItem;
    service.save = save;
    service.headers = Auth.isAuthenticated();

    function getList(fileNo, page, pagesize) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/Note?fileNo='+fileNo+'&page='+page+'&pagesize='+pagesize,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    function getItem(code) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/table/Note/'+code,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });    
    }

    function save(note) {
      var method = note.code ? 'PUT': 'POST';
      var note_ = {
        code: note.code,
        strFileNo: note.strFileNo,
        dtDate: new Date(note.dtDate).toISOString().split('T')[0],
        strNote: note.strNote,
        clsEnteredBy: {
          strName: note.clsEnteredBy.strName
        }
      }

      return $http({
        method: method,
        url: 'http://43.252.215.81/denningwcf/v1/table/Note',
        headers: service.headers,
        data: note_
      }).then(function(response) {
        return response.data;
      });
    }

    return service;
  })

  // =========================================================================
  // Payment Records
  // =========================================================================
  
  .service('paymentRecordService', function($http, Auth){
    var service = {};
    service.getList = getList;
    service.headers = Auth.isAuthenticated();

    function getList(fileNo) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/app/PaymentRecord/'+fileNo,
        headers: service.headers
      }).then(function(resp) {
        return resp.data;
      });  
    }

    return service;
  })
