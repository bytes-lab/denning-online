materialAdmin
  .controller('folderListCtrl', function(NgTableParams, $stateParams, folderService, $state, Auth, $scope, $element) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.dataReady = false;
    self.download = download;
    self.clickHandler = clickHandler;
    self.data = [];
    self.checkboxes = {
      checked: false,
      items: {}
    };

    // watch for check all checkbox
    $scope.$watch(function() {
      return self.checkboxes.checked;
    }, function(value) {
      angular.forEach(self.data, function(item) {
        self.checkboxes.items[item.id] = value;
      });
    });
    
    // watch for data checkboxes
    $scope.$watch(function() {
      return self.checkboxes.items;
    }, function(values) {
      var checked = 0, unchecked = 0,
          total = self.data.length;
      angular.forEach(self.data, function(item) {
        checked   +=  (self.checkboxes.items[item.id]) || 0;
        unchecked += (!self.checkboxes.items[item.id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        self.checkboxes.checked = (checked == total);
      }
      // grayed checkbox
      angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

    folderService.getList($stateParams.id, $stateParams.type).then(function(data) {
      self.title = data.name;
      self.data = [];
      var id = 0;

      angular.forEach(data.documents, function(value, key) {
        id = id + 1;
        value['folder'] = 'Files';
        value['id'] = id;
        self.data.push(value);
      })

      angular.forEach(data.folders, function(folder, key) {
        angular.forEach(folder.documents, function(value, key) {
          value['folder'] = folder.name;
          id = id + 1;
          value['id'] = id;
          self.data.push(value);
        })
      })

      self.dataReady = true;
      initializeTable();
    });

    function download(file, open=false) {
      folderService.download(file.URL).then(function(response) {
        var fileName = file.name + file.ext;
        var contentTypes = {
          '.jpg': 'image/jpeg',
          '.png': 'image/png'
        };

        var contentType = contentTypes[file.ext] || response.headers('content-type');

        try {
            var blob = new Blob([response.data], {type: contentType});
            //IE handles it differently than chrome/webkit
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              var objectUrl = URL.createObjectURL(blob);
              var openFiles = ['.pdf', '.jpg', '.png'];

              if (open && openFiles.indexOf(file.ext) > -1) {
                window.open(objectUrl);                  
              } else {
                var anchor = angular.element('<a/>');
                anchor.attr({
                   href: objectUrl,
                   target: '_blank',
                   download: fileName
                })[0].click();                          
              }
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
