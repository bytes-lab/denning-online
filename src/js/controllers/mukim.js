denningOnline
  .controller('mukimListCtrl', function(NgTableParams, mukimService) {
    var self = this;
    
    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return mukimService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('mukimEditCtrl', function($stateParams, mukimService, $state, refactorService, 
                                         growlService, Auth) 
  {
    var self = this;
  })
