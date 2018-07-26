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

    service.getTemplates = function (docInfo, page, pagesize, keyword='') {
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

    service.generateDoc = function () {
      return http.POST('v1/generateDocument', {
        strFileNo1: "2000-0077",
        mStrLODSerialNo: "",
        strDocumentName: "1. Jay-  SPA- SS - Master Title - 2 Sol",
        strGCode: "16",
        intReportCode: "1100088",
        intVersionID: "5",
        eDocumentType: "11",
        strLangauge: "English",
        eOutput: "11"
      }, 'arraybuffer')
      .then(function (resp) {
        console.log(resp);
      })
    }

    return service;    
  })

