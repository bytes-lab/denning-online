denningOnline
  .controller('folderListCtrl', function(NgTableParams, $sce, $stateParams, $uibModal, 
                                         $state, Auth, $scope, $element, 
                                         growlService, refactorService, folderService, AWSACCESSKEY) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.data = [];
    self.checkboxes = {
      checked: false,
      items: {}
    };

    self.type = $stateParams.type;
    self.code = $stateParams.id;  // for contact / property
    self.keyboard = '';
    self.keyword = '';
    self.fileType = 'all';

    // watch for check all checkbox
    $scope.$watch(function() {
      return self.checkboxes.checked;
    }, function(value) {
      if (self.data.length > 0) {
        angular.forEach(self.data, function(item) {
          self.checkboxes.items[item.id] = value;
        });
      }
    });
    
    // watch for data checkboxes
    $scope.$watch(function() {
      return self.checkboxes.items;
    }, function(values) {
      if (self.data.length > 0) {
        var checked = 0, 
            unchecked = 0,
            total = self.data.length;

        angular.forEach(self.data, function(item) {
          checked   +=  (self.checkboxes.items[item.id]) || 0;
          unchecked += (!self.checkboxes.items[item.id]) || 0;
        });

        if (unchecked == 0 || checked == 0) {
          self.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", 
          (checked != 0 && unchecked != 0));
      }
    }, true);

    if ($stateParams.id && $stateParams.type) {
      folderService.getList($stateParams.id, $stateParams.type).then(function (data) {
        if (self.type == 'matter') {
          self.fileNo = refactorService.parseFileNo(data.name).no;
          self.fileName = refactorService.parseFileNo(data.name).name;        
        }

        self.data = [];
        self.folders = [];

        var id = 0;

        angular.forEach(data.documents, function(value, key) {
          value['folder'] = 'FILES (' + data.documents.length + ')';
          value['id'] = ++id;
          self.data.push(value);
        })

        angular.forEach(data.folders, function(folder, key) {
          self.folders.push(folder);

          if (folder.documents.length == 0) {
            self.data.push({ id: ++id, folder: folder.name });
          } else {
            angular.forEach(folder.documents, function(value, key) {
              value['folder'] = folder.name + ' ('+ folder.documents.length +')';
              value['id'] = ++id;
              self.data.push(value);
            })
          }
        })

        self.initializeTable();
      });      
    }

    self.download = function (file) {
      folderService.download(file.URL).then(function(response) {
        var fileName = file.name + file.ext;
        var contentTypes = {
          '.jpg': 'image/jpeg',
          '.png': 'image/png',
          '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        var contentType = contentTypes[file.ext] || response.headers('content-type');

        try {
          var blob = new Blob([response.data], {type: contentType});

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            Object.assign(document.createElement('a'), { 
              href: URL.createObjectURL(blob), 
              download: fileName})
            .click();
          }
        } catch (exc) {
          console.log("Save Blob method failed with the following exception.");
          console.log(exc);
        }
      })
    }

    self.preview = function (file) {
      var openFiles = ['.jpg', '.png', '.jpeg'];
      folderService.getLink(file.URL.replace('/document/', '/getOneTimeLink/')).then(function (data) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'preview-doc.html',
          controller: function ($scope, $sce) {
            var url = 'https://docs.google.com/gview?url=https://denningchat.com.my/denningwcf/' +
                      data + '&embedded=true';
            if (openFiles.indexOf(file.ext) > -1) {
              url = 'https://denningchat.com.my/denningwcf/' + data;
            }

            $scope.url = $sce.trustAsResourceUrl(url);
            $scope.filename = file.name + file.ext;
            $scope.origin_url = 'https://denningchat.com.my/denningwcf/' + data;

            $scope.download = function () {
              self.download(file);
            }
          },
          size: 'lg',
          keyboard: true
        }).result.then(function () {}, function (res) {});
      });
    }

    self.initializeTable = function () {
      var _data = self.data.filter(function (item) {
        return !item.name || item.name.search(new RegExp(self.keyword, "i")) > -1 && 
                            (self.fileType == 'all' || self.fileType.indexOf(item.ext) > -1);
      });

      self.tableFilter = new NgTableParams({
        page: 1,
        count: 5,
        sorting: {
          date: 'desc' 
        },
        group: "folder"
      }, {
        dataset: _data,
        groupOptions: {
          isExpanded: self.keyword.trim()
        }
      })
    }

    self.refresh = function () {
      $state.reload();
    }

    self.getSelectedFiles = function () {
      var files = [],
          ids = [];

      for (ii in self.checkboxes.items) {
        if (self.checkboxes.items[ii]) {
          ids.push(ii);
        }
      }

      angular.forEach(self.data, function(value, key) {
        if (ids.indexOf(value.id.toString()) > -1 && value.URL) {
          files.push(value);
        }
      })
      return files;
    }

    self.moveFile = function(operation) {
      var files = self.getSelectedFiles();
      if (files.length == 0) {
        alert('Please select files to move / copy.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'folderModal.html',
        controller: 'moveDocModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          files: function () {
            return files;
          },
          choosen: function () {
            return { key: $stateParams.id }
          },
          folders: function () {
            return self.folders;
          },
          actionType: function () {
            return operation;
          }
        }
      });
    }

    self.renameFolder = function (folderName) {
      var folder;
      for (ii in self.folders) {
        if (self.folders[ii].name == folderName) {
          folder = self.folders[ii];
          break;
        }
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'fileModal.html',
        controller: 'renameDocModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          file: function () {
            return folder;
          }, 
          matter: function () {
            return $stateParams.id;
          },
          type: function () {
            return 'Folder';
          }
        }
      });
    }

    self.renameDoc = function (file) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'fileModal.html',
        controller: 'renameDocModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          file: function () {
            return file;
          }, 
          matter: function () {
            return $stateParams.id;
          },
          type: function () {
            return 'Document';
          }
        }
      });
    }

    self.shareFile = function (file) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'shareModal.html',
        controller: 'shareModalCtrl',
        size: '',
        keyboard: true,
        resolve: {
          file: function () {
            return file;
          },
          matter: function () {
            return $stateParams.id;
          }
        }
      }).result.then(function () {}, function (res) {});
    }

    self.deleteFolder = function (folderName) {
      if (!confirm("Are you sure to delete this folder?")) {
        return false;
      }

      var folder;
      for (ii in self.folders) {
        if (self.folders[ii].name == folderName) {
          folder = self.folders[ii];
          break;
        }
      }

      folderService.deleteDocument(folder.URL).then(function () {
        growlService.growl('The Folder deleted successfully!', 'success');
        $state.reload();
      })
    }

    self.createFolder = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'newFolderModal.html',
        controller: 'newFolderModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          matter: function () {
            return $stateParams.id;
          }
        }
      });
    }

    self.deleteFile_ = function (files) {
      if (files.length == 0) {
        alert('Please select files to delete.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'fileDeleteModal.html',
        controller: 'deleteModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          files: function () {
            return files;
          }
        }
      });
    }

    self.deleteFiles = function () {
      var files = self.getSelectedFiles();
      self.deleteFile_(files);
    }

    self.deleteFile = function (file) {
      self.deleteFile_([file]);
    }

    self.attachFile = function() {
      var files = self.getSelectedFiles();
      if (files.length == 0) {
        alert('Please select files to attach.');
        return;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'linksModal.html',
        controller: 'linksModalCtrl as vm',
        size: 'lg',
        keyboard: true,
        resolve: {
          files: function () {
            return files;
          },
          type: function () {
            return self.type;
          },
          code: function () {
            return self.code;
          },
        }
      }).result.then(function () {}, function (res) {});
    }

    self.copyLink = function(file) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'linkModal.html',
        controller: 'linkModalCtrl',
        size: '',
        keyboard: true,
        resolve: {
          file: function () {
            return file;
          }
        }
      }).result.then(function () {}, function (res) {});
    }
  })

  .controller('linkModalCtrl', function ($scope, $uibModalInstance, $state, growlService, 
                                         folderService, file, ngClipboard) 
  {
    $scope.file = file;
    $scope.inputType = 'password';
    $scope.btnIcon = 'zmdi-eye';
    $scope.showIcon = false;
    $scope.minDate = new Date();
    $scope.data = {
      expireDate: new Date()
    };

    $scope.getLink = function () {
      $scope.glink = true;
      url = file.URL.replace('/document/', '/getOneTimeLink/');
      if ($scope.set_expiration) {
        url += '?exp=' + $scope.data.expireDate.toISOString().split('T')[0];
      }

      if ($scope.set_password) {
        if ($scope.set_expiration) {
          url += '&pwd=' + $scope.password;
        } else {
          url += '?pwd=' + $scope.password;
        }
      }

      folderService.getLink(url).then(function (data) {
        $scope.link = 'https://denningchat.com.my/denningwcf/' + data;
      })
    }

    $scope.togglePass = function () {
      $scope.showIcon = !$scope.showIcon;
      if ($scope.showIcon) {
        $scope.inputType = 'text';
        $scope.btnIcon = 'zmdi-eye-off';
      } else {
        $scope.inputType = 'password';
        $scope.btnIcon = 'zmdi-eye';
      }
    }

    $scope.copyLink = function () {
      ngClipboard.toClipboard($scope.link);
      growlService.growl('Link copied successfully!', 'success'); 
    }
  })

  .controller('linksModalCtrl', function ($scope, $uibModalInstance, $state, growlService, 
                                          folderService, files, ngClipboard, AWSACCESSKEY,
                                          AWSSECRETACCESSKEY, Auth, contactService, type, code) 
  {
    var userInfo = Auth.getUserInfo();
    var self = this;
    $scope.progress = 0;

    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;

    self.sendTo = [];
    self.sendCC = [];
    self.sendBCC = [];
    self.sendFrom = null;

    self.filterSelected = true;
    self.filterContacts = function (keyword) {
      return contactService.searchEmail(keyword).then(function (resp) {
        return resp.data
      })
    }
  
    contactService.getMailServerList().then(function (resp) {
      self.mailServers = resp.data;
    })

    // amazon aws credentials
    AWS.config.update({
      accessKeyId : AWSACCESSKEY,
      secretAccessKey : AWSSECRETACCESSKEY
    });
    // amazon s3 region
    AWS.config.region = 'ap-southeast-1';
    //amazon s3 bucket name
    var bucket = new AWS.S3({params: {Bucket: 'denning.mailattachment'}});

    const uploadS3 = function (file) {
      return new Promise(function (resolve, reject) {
        folderService.download(file.URL).then(function(response) {
          var fileName = file.name + file.ext;
          var contentTypes = {
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          };

          var contentType = contentTypes[file.ext] || response.headers('content-type');

          try {
            var blob = new Blob([response.data], {type: contentType});
            var params = {Key:   fileName, ContentType: contentType, Body: blob};
            bucket.upload(params).send(function(err, data) {
              if (data) {
                //displays the image location on amazon s3 bucket
                resolve(data.Location);
              }
            });
          } catch (exc) {
            console.log("Save Blob method failed with the following exception.");
            reject(exc);
          }
        })
      });
    };

    $scope.emailSubject = 'Documents of ' + type + ' ( '+code+' )';

    Promise.all(files.map(function(file) {
      return uploadS3(file);
    })).then(function(s3Files) {
      $scope.links = [];
      $scope.links_ = '';

      for (ii in s3Files) {
        var link = s3Files[ii],
            fileName = files[ii].name + files[ii].ext,
            glink = 'https://docs.google.com/gview?url=' + link,
            anchor = '<a href="' + glink +'">' + fileName + '</a>';
        $scope.links.push(anchor);
        $scope.links_ += fileName + '<br>' + glink + '<br>';
      }

      $scope.glink = true;
    });

    $scope.files = files;
    $scope.glink = false;

    $scope.copyLink = function () {
      ngClipboard.toClipboard($scope.links_);
      growlService.growl('Links copied successfully!', 'success'); 
    }

    $scope.sendEmail = function () {
      if (self.sendFrom == null) {
        alert("Please choose a mail server.");
        return;
      }

      var sendTo = self.sendTo.map(function (contact) { return contact.strEmailAddress; }).filter(function(email) { return email != ''; });
      if (sendTo.length == 0) {
        alert("Please choose contacts with email.");
        return;
      }

      var emailData = {
        awsLinkAttachment: $scope.links,
        bodyHTML: $scope.emailBody,
        denningOriginalAttachment: files.map(function(file) { return file.URL; }),
        emailFrom: self.sendFrom,
        emailTo: sendTo,
        emailTo_cc: self.sendCC.map(function (contact) { return contact.strEmailAddress; }).filter(function(email) { return email != ''; }),
        emailTo_bcc: self.sendBCC.map(function (contact) { return contact.strEmailAddress; }).filter(function(email) { return email != ''; }),
        subject: $scope.emailSubject
      }

      folderService.sendEmail(emailData).then(function (resp) {
        $uibModalInstance.close();
        growlService.growl('Email sent successfully!', 'success'); 
      })
    }
  })

  .controller('moveDocModalCtrl', function ($scope, $uibModalInstance, $state, growlService, 
                                            folderService, files, searchService, choosen, 
                                            folders, actionType) 
  {
    $scope.data = {
      folderName: '',
      choosen: choosen,
      searchRes: [],
      dest: null
    };

    $scope.files = files;
    $scope.files_ = angular.copy(files);
    $scope.searchCategory = "self";
    $scope.hasFolder = true;
    $scope.selfFolder = true;
    $scope.choosen_ = angular.copy(choosen);
    $scope.folders = folders;
    $scope.actionType = actionType;
    $scope.folderType = 'matter';
    
    $scope.search = function (query) {
      return searchService.keyword(query).then(function (data) {
        return data;
      });
    }

    $scope.mainSearch = function (item) {
      if (item) {
        $scope.data.choosen = null;
        $scope.data.searchRes = [];

        searchService.search(item.keyword, $scope.searchCategory, 1, 0).then(function (resp) {
          $scope.data.searchRes = resp.data;
          if ($scope.searchCategory == '1' && resp.data.length > 0) {
            $scope.data.choosen = resp.data[0];
          }
        });
      }
    }

    $scope.getResults = function (keyword) {
      return $scope.data.searchRes.filter(function(item) {
        return (item.Title || item.Desc).search(new RegExp(keyword, "i")) > -1;
      });
    }

    $scope.categoryChange = function (item) {
      $scope.folderType = 'matter';
      $scope.data.searchRes = [];
      if (["0", "2", "self"].indexOf($scope.searchCategory) > -1) {
        $scope.hasFolder = true;
      } else {
        $scope.hasFolder = false;
      }

      if (["transit", "self"].indexOf($scope.searchCategory) < 0) {
        $scope.selfFolder = false;
        $scope.data.choosen = null;
      } else {
        $scope.selfFolder = true;

        if ($scope.searchCategory == "self") {
          $scope.data.choosen = $scope.choosen_;
        } else {
          $scope.data.choosen = { key: "transit folder" };
        }
      }
    }

    $scope.chooseItem = function (item) {
      if (item) {
        $scope.folders = [];
        $scope.data.folderName = '';

        if (item.Title.indexOf('File No') == 0 || item.Title.indexOf('Matter') == 0) {
          $scope.folderType = 'matter';

          folderService.getList(item.key, 'matter').then(function (data) {
            angular.forEach(data.folders, function(folder, key) {
              $scope.folders.push(folder);
            })
          })

          if ($scope.folders.length > 0) {
            $scope.data.folderName = $scope.folders[0].name;
          }
        } else if (item.Title.indexOf('Contact') == 0) {
          $scope.folderType = 'contact';
        } else if (item.Title.indexOf('Property') == 0) {
          $scope.folderType = 'property';
        }
      }
    }

    $scope.ok = function () {
      if (!$scope.data.choosen.key) {
        alert("Choose a proper destination!");
        return false;
      }

      var moves = [];
      for (ii in $scope.files_) {
        file = $scope.files_[ii];

        param = {
          "sourceFileURL" : file.URL,
          "newCode" : $scope.data.choosen.key,
          "folderType": $scope.folderType,
          "newSubFolder" : $scope.data.folderName,
          "newName" : file.name+file.ext
        };

        if ($scope.actionType == 'Move') {
          moves.push(folderService.moveDocument(param));
        } else {
          moves.push(folderService.copyDocument(param));
        }
      }

      Promise.all(moves).then(function (data) {
        $uibModalInstance.close();
        if ($scope.actionType == 'Move') {
          growlService.growl('Files moved successfully!', 'success');
        } else {
          growlService.growl('Files copied successfully!', 'success');
        }
        $state.reload();
      })
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  })

  .controller('renameDocModalCtrl', function ($scope, $uibModalInstance, $state, growlService, 
                                              folderService, file, matter, type) 
  {
    $scope.is_valid = 'initial';
    $scope.fileName = file.name;
    $scope.type = type;

    $scope.validate = function () {
      if (!$scope.fileName.trim()) {
        $scope.is_valid = 'has-error';
      } else {
        $scope.is_valid = '';
      }
    }

    $scope.ok = function () {
      if ($scope.is_valid) {
        return false;
      }

      data = {
        newCode : matter,
        newName : $scope.type == "Folder" ? $scope.fileName : $scope.fileName+file.ext
      }

      folderService.renameDocument(file.URL, data).then(function () {
        $uibModalInstance.close();
        growlService.growl('The file renamed successfully!', 'success');
        $state.reload();
      })
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  })

  .controller('newFolderModalCtrl', function ($scope, $uibModalInstance, $state, growlService, 
                                              folderService, matter) 
  {
    $scope.is_valid = 'initial';

    $scope.validate = function () {
      if (!$scope.fileName.trim()) {
        $scope.is_valid = 'has-error';
      } else {
        $scope.is_valid = '';
      }
    }

    $scope.ok = function () {
      if ($scope.is_valid) {
        return false;
      }

      data = {
        newCode : matter,
        newName : $scope.fileName
      }

      folderService.createSubFolder(data).then(function () {
        $uibModalInstance.close();
        $state.reload();
      })
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  })

  .controller('deleteModalCtrl', function($scope, $uibModalInstance, growlService, folderService, 
                                          files, $state) 
  {
    $scope.files = files;
    
    $scope.ok = function () {
      var deletes = [];
      angular.forEach(files, function(value, key) {
        deletes.push(folderService.deleteDocument(value.URL));
      })

      Promise.all(deletes).then(function (data) {
        growlService.growl('Files deleted successfully!', 'success');
        $uibModalInstance.close();
        $state.reload();
      })
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  })

  .controller('shareModalCtrl', function ($scope, $uibModalInstance, growlService, folderService, 
                                          matter, file, matterService) 
  {
    $scope.data = {
      fileNo: matter,
      file: file,
      contacts: [],
      shared: {}
    };

    $scope.range = function (min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
          input.push(i);
      }
      return input;
    } 

    matterService.getItem(matter).then(function (item) {
      $scope.data.matter = item;
      for (var i = 1; i <= 6; i++) {
        $scope.data.contacts.push({
          label: item.clsMatterCode['strGroupC'+i],
          start: (i - 1) * 5 + 1,
          end: (i - 1) * 5 + 5
        })
      }
      
      // get shared info
      folderService.getShares(file.URL).then(function (item) {
        for (var i = 1; i <= 30; i++) {
          $scope.data.shared[i] = 'No';
          for (jj in item) {
            if (item[jj].clsContact.code == $scope.data.matter['clsC'+i].code) {
              $scope.data.shared[i] = 'Yes';
              break;
            }
          }
        }
      })
    })


    $scope.share = function (contact) {
      data = {
          clsContact: { code: contact.code },
          boolIsActive: 1
      }

      folderService.share(file.URL, data).then(function (item) {
        
      })
    }
  })
