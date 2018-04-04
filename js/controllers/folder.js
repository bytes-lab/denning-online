materialAdmin
  .controller('folderListCtrl', function(NgTableParams, $stateParams, folderService, $state, Auth) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;
    self.userInfo = Auth.getUserInfo();
    self.search = search;
    self.keyword = '';

    folderService.getList($stateParams.id, $stateParams.type).then(function(data) {
      self.title = data.name;
      self.data = [];

      angular.forEach(data.documents, function(value, key) {
        value['folder'] = 'Files';
        self.data.push(value);
      })

      angular.forEach(data.folders, function(folder, key) {
        angular.forEach(folder.documents, function(value, key) {
          value['folder'] = folder.name;
          self.data.push(value);
        })
      })

      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('land-PTGs.edit', {'id': item.code});
    }
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        count: 5,
        sorting: {
          name: 'asc' 
        },
        group: "folder"
      }, {
        dataset: self.data
      })
    } 

    function search() {
      self.tableFilter.reload();
    }
  })
