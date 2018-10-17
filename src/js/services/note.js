denningOnline
  // =========================================================================
  // Notes
  // =========================================================================
  
  .service('noteService', function(http) {
    var service = {};

    service.getList = function (fileNo, page, pagesize) {
      return http.GET('v1/table/Note', {
        fileNo: fileNo,
        page: page,
        pagesize: pagesize
      }).then(function(resp) {
        return resp.data;
      });  
    }

    service.getItem = function(code) {
      return http.GET('v1/table/Note/'+code).then(function(resp) {
        return resp.data;
      });    
    }

    service.save = function (note) {
      var method = note.code ? 'PUT': 'POST';
      var note_ = {
        code: note.code,
        strFileNo: note.strFileNo,
        dtDate: new Date(note.dtDate).toISOString().split('T')[0],
        strNote: note.strNote
      }

      return http[method]('v1/table/Note', note_).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    return service;
  })

  // =========================================================================
  // Payment Records
  // =========================================================================
  
  .service('paymentRecordService', function(http) {
    var service = {};

    service.getList = function (fileNo) {
      return http.GET('v1/app/PaymentRecord/'+fileNo).then(function(resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/PaymentRecord/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/PaymentRecord', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/PaymentRecord', { 
        code: entity.code 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getPaymentMethodList = function () {
      return http.GET('v1/Table/cboPaymentMode').then(function (resp) {
        return resp.data;
      });
    }

    return service;
  })
