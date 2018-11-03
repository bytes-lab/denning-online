denningOnline
  // =========================================================================
  // DOC TEMPLATE
  // =========================================================================
  
  .service('templateService', function(http) {
    var service = {};

    service.getIndustries = function () {
      return http.GET('v1/table/cboTemplateCategory/industryDropDown').then(function (resp) {
        return resp.data;
      });
    }

    service.getCategories = function (filter) {
      return http.GET('v1/table/cboTemplateCategory/categoryDropDown', {
        industry: filter.industry
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getTypes = function (filter) {
      return http.GET('v1/table/cboTemplateCategory/typeDropDown', {
        industry: filter.industry,
        category: filter.category
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getSubTypes = function (filter) {
      return http.GET('v1/table/cboTemplateCategory/subTypeDropDown', {
        industry: filter.industry,
        category: filter.category,
        type: filter.type
      }).then(function (resp) {
        return resp.data;
      });
    }

    service.getTemplates = function (docInfo, page, pagesize, keyword) {
      return http.GET('v1/table/cboTemplate', {
        fileno: docInfo.fileno,
        Online: docInfo.source.toLowerCase(),
        category: docInfo.category,
        type: docInfo.subType,
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    // service.getTemplates = function (filter, page, pagesize, keyword) {
    //   var url = 'v1/table/cboTemplateCategory/'+filter.industry+'/'+filter.category+'/'+filter.group+'/'+filter.subGroup;
    //   return http.GET(url, {
    //     fileno: filter.fileno,
    //     Online: filter.source.toLowerCase(),
    //     page: page,
    //     pagesize: pagesize,
    //     search: keyword
    //   }).then(function (resp) {
    //     return resp;
    //   });
    // }

    service.generateDoc = function (entity) {
      return http.POST('v1/GenerateDocumentnPreview', JSON.parse(entity.generateBody))
      .then(function (resp) {
        return resp.data;
      })
    }

    return service;
  })

