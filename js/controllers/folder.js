materialAdmin
  .controller('folderListCtrl', function(NgTableParams, $stateParams, folderService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.dataReady = false;
    self.download = download;
    self.clickHandler = clickHandler;
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

    function download(file) {
      folderService.download(file.URL).then(function(response) {
        var fileName = file.name + file.ext;
        var contentType = response.headers('content-type');

        try {
            var blob = new Blob([response.data], {type: contentType});
            //IE handles it differently than chrome/webkit
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                var objectUrl = URL.createObjectURL(blob);
                // window.open(objectUrl);
                var anchor = angular.element('<a/>');
                anchor.attr({
                   href: objectUrl,
                   target: '_blank',
                   download: fileName
                })[0].click();        
            }
        } catch (exc) {
            console.log("Save Blob method failed with the following exception.");
            console.log(exc);
        }
      })
    }

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
  })
