denningOnline
  // =========================================================================
  // DOC TEMPLATE
  // =========================================================================
  
  .service('templateService', function(http) {
    var service = {};

    service.getCategories = function () {
      return http.GET('v1/table/cbotemplatecategory/only').then(function (resp) {
        return resp.data;
      });
    }

    service.getTypes = function (category) {
      return http.GET('v1/table/cbotemplatecategory', {
        filter: category
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getTemplates = function (docInfo, page, pagesize, keyword) {
      return http.GET('v1/table/cboTemplate', {
        fileno: docInfo.fileno,
        Online: docInfo.source.toLowerCase(),
        category: docInfo.category,
        type: docInfo.type,
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    service.generateDoc = function (entity) {
      return http.POST('v1/generateDocument', JSON.parse(entity.generateBody), 'arraybuffer')
      .then(function (resp) {
        return resp;
      })
    }

    return service;    
  })

