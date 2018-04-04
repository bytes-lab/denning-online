materialAdmin
  .controller('folderListCtrl', function(NgTableParams, folderService, $state, Auth) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;
    self.userInfo = Auth.getUserInfo();
    self.search = search;
    self.keyword = '';

    function clickHandler(item) {
      $state.go('properties.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,      // show first page
      count: 25,
      sorting: {
        name: 'asc'   // initial sorting
      }
    }, {
      getData: function(params) {
        return propertyService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })    

    function search() {
      self.tableFilter.reload();
    }
  })
