materialAdmin
  .controller('folderListCtrl', function(NgTableParams, $stateParams, folderService, contactService, $state, Auth, $scope, $element, growlService) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.download = download;

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

    self.upload = function() {
      self.uploaded = 0;
      angular.element('.file-upload').click();
    };

    self.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

      var info = {
        "fileNo1": $stateParams.id,
        "documents":[
          {
            "FileName": fileObj.filename,
            "MimeType": fileObj.filetype,
            "dateCreate": file.lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "dateModify": file.lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "fileLength": fileObj.filesize,
            "base64": fileObj.base64
          }
        ]
      };

      contactService.upload(info, 'matter', fileOjects).then(function(res) {
        self.uploaded = self.uploaded + 1;
        if (fileList.length == self.uploaded) {
          alert('The file(s) uploaded successfully.');
          $state.reload();
        }
      })
      .catch(function(err){
      });
    };

    self.copy_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to copy.');
      }      
    }

    self.move_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to move.');
      }      
    }
    self.share_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to share.');
      }      
    }
    self.delete_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to delete.');
      }      
    }
    self.attach_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to attach.');
      }      
    }

    self.copySuccess = function(e) {
      e.clearSelection();
      growlService.growl('Link copied successfully!', 'success'); 
    }
  })
