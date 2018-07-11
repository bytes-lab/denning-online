materialAdmin
  // =========================================================================
  // File Matter, Matter Code, Matter Form
  // =========================================================================
  
  .service('fileMatterService', function(http) {
    var service = {};

    service.getList = function (page=1, pagesize=25, keyword='') {
      return http.GET('/v1/generalSearch/file?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });  
    }

    service.getItem = function (code) {
      return http.GET('/v1/table/File/'+code).then(function(resp) {
        return resp.data;
      });  
    }

    service.getIDTypeList = function () {
      return http.GET('/v1/IDType').then(function(resp) {
        return resp.data;
      });  
    }

    service.getSalutationList = function () {
      return http.GET('/v1/Salutation').then(function(resp) {
        return resp.data;
      });  
    }

    service.getIRDBranchList = function () {
      return http.GET('/v1/IRDBranch').then(function(resp) {
        return resp.data;
      });
    }

    service.save = function (contact) {
      delete contact.relatedMatter;
      contact.title = contact.title.description;

      if (contact.code) {
        return http.PUT('/v1/app/contact', contact).then(function(response) {
          return response.data;
        });
      } else {
        return http.POST('/v1/app/contact', contact).then(function(response) {
          return response.data;
        });
      }
    }

    service.delete = function (contact) {
    }

    return service;
  })

  .service('matterCodeService', function(http, Auth){
    var service = {};

    service.getList = function (page=1, pagesize=500, keyword='') {
      return http.GET('/v1/table/MatterCode?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('/v1/table/MatterCode/'+code).then(function(resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      console.log(entity);
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;
      delete entity.clsEnteredBy;
      delete entity.clsUpdatedBy;
      delete entity.intTurnaroundTime;
      delete entity.boolIsDeleted;
      delete entity.boolChkSubsaleCD;

      if (entity.code) {
        return http.PUT('/v1/table/MatterCode',entity).then(function(response) {
          return response.data;
        });
      } else {
        return http.POST('/v1/table/MatterCode',entity).then(function(response) {
          return response.data;
        });
      }
    }

    return service;
  })

  .service('matterFormService', function(http){
    var service = {};

    service.getList = function (page=1, pagesize=500, keyword='') {
      return http.GET('/v1/table/MatterCodeEditForm?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp.data;
      });  
    }

    service.getItem = function (code) {
      return http.GET('/v1/table/MatterCodeEditForm/'+code).then(function(resp) {
        return resp.data;
      });    
    }

    service.save = function (entity) {
      delete entity.dtDateEntered;
      delete entity.dtDateUpdated;
      delete entity.intCategory;
      delete entity.intOrdering;

      if (!entity.code || entity.code.length == 0) {
        entity.code = 'frmFile' + entity.strDisplayName.replace(' ', '');
      }

      if (entity.code) {
        return http.PUT('/v1/table/MatterCodeEditForm', entity).then(function(response) {
          return response.data;
        });
      } else {
        return http.POST('/v1/table/MatterCodeEditForm', entity).then(function(response) {
          return response.data;
        });
      }
    }

    return service;
  })
