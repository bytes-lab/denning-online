denningOnline
  // =========================================================================
  // Matter, Matter Code, Matter Form
  // =========================================================================
  
  .service('matterService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/generalSearch/file', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getRelatedMatters = function (type, code) {
      return http.GET('v1/table/'+type+'/relatedmatter/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.getProgramOwnerList = function (page, pagesize, keyword) {
      return http.GET('v1/table/ProgramOwner', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getCurrencyList = function (page, pagesize, keyword) {
      return http.GET('v1/Currency', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/File/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.getItemApp = function (code) {
      return http.GET('v1/app/matter/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.getIDTypeList = function () {
      return http.GET('v1/IDType').then(function (resp) {
        return resp.data;
      });
    }

    service.getFileStatusList = function () {
      return http.GET('v1/table/FileStatus').then(function (resp) {
        return resp;
      });
    }

    service.getSalutationList = function () {
      return http.GET('v1/Salutation').then(function (resp) {
        return resp.data;
      });
    }

    service.getIRDBranchList = function () {
      return http.GET('v1/IRDBranch').then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (matter) {
      var method = matter.strFileNo1 ? 'PUT': 'POST';
      return http[method]('v1/table/File', matter).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/File', { code: entity.strFileNo1 }).then(function (resp) {
        return resp;
      });
    }

    return service;
  })

  .service('matterCodeService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/table/MatterCode', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.getCategories = function () {
      return http.GET('v1/table/cboMatterCategory').then(function (resp) {
        return resp.data;
      });
    }

    service.getDepartments = function () {
      return http.GET('v1/table/ListDepartment').then(function (resp) {
        return resp.data;
      });
    }

    service.getIndustries = function () {
      return http.GET('v1/generalSelection/frmMatter/cboIndustry').then(function (resp) {
        return resp.data;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/MatterCode/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/MatterCode', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/MatterCode', { code: entity.code }).then(function (resp) {
        return resp;
      });
    }

    return service;
  })

  .service('matterFormService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword, filterType) {
      return http.GET('v1/table/MatterCodeEditForm', {
        page: page,
        pagesize: pagesize,
        search: keyword,
        filter: filterType
      }).then(function (resp) {
        return resp;
      });
    }

    service.getItem = function (code) {
      return http.GET('v1/table/MatterCodeEditForm/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';
      if (!entity.code) {
        entity.code = 'frmFile' + entity.strDisplayName.replace(' ', '');
      }

      return http[method]('v1/table/MatterCodeEditForm', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/MatterCodeEditForm', { 
        code: entity.code 
      }).then(function (resp) {
        return resp;
      });
    }

    return service;
  })
