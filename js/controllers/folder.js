denningOnline
  .controller('folderListCtrl', function(NgTableParams, $stateParams, $uibModal, folderService, contactService, $state, Auth, $scope, $element, growlService, ngClipboard) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

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

    folderService.getList($stateParams.id, $stateParams.type).then(function (data) {
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

    self.download = function ($event, file, open=false) {
      var openFiles = ['.pdf', '.jpg', '.png', '.jpeg'];

      if (open && openFiles.indexOf(file.ext) > -1) {
        $event.target.href = $state.href('open-file', { url: JSON.stringify(file) });
      } else {
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

                const a = document.createElement('a');
                a.style = 'display: none';
                // document.body.appendChild(a);
                
                a.href = objectUrl;
                a.download = fileName;
                // a.click();
                // window.URL.revokeObjectURL(objectUrl);
                Object.assign(document.createElement('a'), { href: objectUrl, download: fileName}).click();
              }
          } catch (exc) {
              console.log("Save Blob method failed with the following exception.");
              console.log(exc);
          }
        })
      }
    }

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 5,
        sorting: {
          date: 'desc' 
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

    self.refresh = function () {
      $state.reload();
    }
    
    self.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = typeof file.lastModified === "number" ? new Date(file.lastModified) : file.lastModifiedDate;

      var info = {
        "fileNo1": $stateParams.id,
        "documents":[
          {
            "FileName": fileObj.filename,
            "MimeType": fileObj.filetype,
            "dateCreate": lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "dateModify": lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
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
        return false;
      }

      var urls = [];
      var ids = Object.keys(self.checkboxes.items);

      angular.forEach(self.data, function(value, key) {
        if (ids.indexOf(value.id.toString()) > -1) {
          urls.push(value.URL);
        }
      })

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'folderModal.html',
        controller: 'moveDocModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          urls: function () {
            return urls;
          }, 
          matter: function () {
            return $stateParams.id;
          }
        }
      });
    }

    self.share_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to share.');
      }
    }

    self.delete_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to delete.');
        return false;
      }

      var deletes = [];
      var ids = Object.keys(self.checkboxes.items);

      angular.forEach(self.data, function(value, key) {
        if (ids.indexOf(value.id.toString()) > -1) {
          deletes.push(folderService.deleteDocument(value.URL));
        }
      })

      Promise.all(deletes).then(function (data) {
        growlService.growl('Files deleted successfully!', 'success');
        $state.reload();
      })
    }

    self.attach_file = function() {
      if (angular.equals(self.checkboxes.items, {})) {
        alert('Please select files to attach.');
        return;
      }

      var urls = '';
      var ids = Object.keys(self.checkboxes.items);

      angular.forEach(self.data, function(value, key) {
        if (ids.indexOf(value.id.toString()) > -1) {
          urls += value.name + value.ext + '\n';
        }
      })
      ngClipboard.toClipboard(urls);
      growlService.growl('Links copied successfully!', 'success');
    }

    self.copySuccess = function(e) {
      e.clearSelection();
      growlService.growl('Link copied successfully!', 'success'); 
    }
  })

  .controller('openFileCtrl', function($stateParams, folderService) {
      var file = JSON.parse($stateParams.url);
      folderService.download(file.URL).then(function(response) {
        var fileName = file.name + file.ext;
        var contentTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
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

              location.href = objectUrl;
            }
        } catch (exc) {
            console.log("Save Blob method failed with the following exception.");
            console.log(exc);
        }
      })    
  })

  .controller('moveDocModalCtrl', function ($scope, $uibModalInstance, $state, folderService, urls, matter) {
    $scope.validate = function () {
      if (!$scope.folderName.trim()) {
        $scope.is_valid = 'has-error';
      } else {
        $scope.is_valid =  '';
      }
    }

    $scope.ok = function () {
      if ($scope.is_valid) {
        return false;
      }
      // service.delete(entity).then(function () {
      //   if (on_list) {
      //     $state.reload();
      //   } else {
      //     $state.go(return_state);
      //   }
      // }).catch(function(err){
      //   //$scope.formname.contactInfo.$error.push({meessage:''});
      // });
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
      // if (on_list) {
      //   $state.go(return_state);
      // }
    };
  })
