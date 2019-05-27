denningOnline

  .controller('denningOnlineCtrl', function($state, $scope, growlService, Auth, http, $interval,
                                            searchService, $rootScope, folderService)
  {
    var self = this;
    self.searchCategory = 0;

    $scope.app = { 
      loadChat: false,
      userInfo: null
    };

    // Detact Mobile Browser
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
       angular.element('html').addClass('ismobile');
    }

    // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
    this.sidebarToggle = {
      left: false,
      right: false,
      task: false,
      border: 'border-line'
    }
    // By default template has a boxed layout
    this.layoutType = localStorage.getItem('ma-layout-status');
    
    // For Mainmenu Active Class
    this.$state = $state;  
    
    this.getLogo = function () {
      return Auth.getUserInfo().logo;
    }
    
    //Close sidebar on click
    this.sidebarStat = function(event) {
      if (!angular.element(event.target).parent().hasClass('active')) {
        this.sidebarToggle.left = false;
      }
    }
    //Login Funcs

    $rootScope.isAuthenticated = function () {
      return Auth.isAuthenticated();
    };

    $rootScope.logout = function () {
      Auth.logout();
      self.sidebarToggle.right = false;
      $state.go('login');
    };

    this.isAuthenticated = function () {
      return Auth.isAuthenticated();
    };

    this.logout = function () {
      Auth.logout();
      self.sidebarToggle.right = false;
      $scope.app.loadChat = false;
      $state.go('login');
    };

    //Listview Search (Check listview pages)
    this.listviewSearchStat = false;
    
    this.lvSearch = function() {
      this.listviewSearchStat = true; 
    }

    //Skin Switch
    this.currentSkin = 'blue';

    self.getSearchCategories = function () {
      if (self.searchCategories) {
        return self.searchCategories;
      } else {
        self.searchCategories = ['loading'];
        searchService.getFilter().then(function (data) {
          self.searchCategories = data;
          return self.searchCategories;
        });
      }
    }

    // format date over the site
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    $scope.format = 'dd/MM/yyyy';

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    self.searchKeyPressed = function (events, item) {
      if(event.which == 13) {
        // hide list for not keyword
        $('#search_filter').focus();
        self.selectedItemChange();
      }
    }

    self.searchFilterChange = function (category) {
      self.searchCategory = category;
      self.selectedItemChange();
    }

    self.querySearch = function (query) {
      return searchService.keywordV2(query).then(function (data) {
        return data;
      });
    }

    self.searchTextChange = function (text) {
      self.searchCategory = 0;
      self.currentText = { keyword: text, display: text };
    }

    self.totalSearchResult = 0;
    self.infiniteSearchItems = {
      numLoaded_: 0,
      toLoad_: 0,
      items: [],
      keyword: '',
      page: 1,
      hasMoreData: true,
      hold: false,
      auto: 1,

      // Required.
      getItemAtIndex: function (index) {
        if (index > this.numLoaded_) {
          this.fetchMoreItems_(index);
          return null;
        }
        return this.items[index];
      },

      // Required.
      getLength: function () {
        return this.numLoaded_ + 10;
      },

      init: function(keyword, auto) {
        this.numLoaded_ = 0;
        this.toLoad_ = 0;
        this.items = [];
        this.keyword = keyword;
        this.page = 1;
        this.hasMoreData = true;
        this.hold = false;
        this.auto = auto;
      },

      fetchMoreItems_: function (index) {
        if (this.toLoad_ < index && this.keyword && this.hasMoreData && !this.hold) {
          this_ = this;
          this_.hold = true;

          searchService.searchV2(this.keyword, self.searchCategory, this.page, 10, this.auto).then(function (resp) {
            this_.hold = false;

            if (resp.total == '0') {
              this_.hasMoreData = false;
            } else {
              this_.toLoad_ += 10;
              this_.page += 1;
              self.totalSearchResult = resp.total;
              this_.items = this_.items.concat(resp.data);
              this_.numLoaded_ = this_.toLoad_;
            }
          });
        }
      }
    }

    self.selectedItemChange = function () {
      var _keyword, _auto;
      if (self.selectedItem) {
        _keyword = self.selectedItem.key;
        _auto = 1;
      } else if (self.currentText) {
        _keyword = self.currentText.keyword;
        _auto = 0;
      } else {
        return;
      }

      self.totalSearchResult = 0;
      self.infiniteSearchItems.init(_keyword, _auto);
      self.infiniteSearchItems.getItemAtIndex(1);

      if ($state.current.name != 'search') {
        $state.go('search');
      }
    }

    self.payments = function(item) {
      $state.go('payment-records.list', {fileNo: item.key});
    };

    self.upload = function(code, type, reload) {
      self.uploadType = type;
      self.reload = reload;
      self.key = code;
      self.uploaded = 0;
      angular.element('.file-upload').click();
    };

    self.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = file.lastModifiedDate;
      if (typeof file.lastModified === "number") {
        lastModified = new Date(file.lastModified);
      }

      var info = {
        "fileNo1": self.key,
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

      folderService.upload(info, self.uploadType).then(function (res) {
        self.uploaded = self.uploaded + 1;
        if (fileList.length == self.uploaded) {
          growlService.growl('The file(s) uploaded successfully.', 'success');
          
          if (self.reload) {
            $state.reload();
          }
        }
      });
    };

    self.navItem = function(item) {
      if (item.Title.indexOf('Contact') == 0) {
        $state.go('contacts.edit', {id: item.key});
      } else if (item.Title.indexOf('File No') == 0 || item.Title.indexOf('Matter') == 0) {
        $state.go('file-matters.edit', {'fileNo': item.key});
      } else if (item.Title.indexOf('Property') == 0) {
        $state.go('properties.edit', {id: item.key});
      }
    }

    self.relatedMatter = function(code, type) {
      if (type == 'contact') {
        $state.go('contacts.matters', {id: code});
      } else if (type == 'property') {
        $state.go('properties.matters', {id: code});
      }
    }

    self.notes = function(item) {
      $state.go('notes.list', {fileNo: item.key, fileName: JSON.parse(item.JsonDesc.replace(/[\u0000-\u0019]+/g,"")).primaryClient.name});
    }
    
    self.accounts = function(item) {
      $state.go('accounts.list', {fileNo: item.key, fileName: JSON.parse(item.JsonDesc.replace(/[\u0000-\u0019]+/g,"")).primaryClient.name});
    }

    $scope.startPing = function () {
      // $interval(function () {
      //   http.GET('v1/staffLogin/ping');
      // }, 60000);
    }
  })

  .controller('loginCtrl', function ($rootScope, $scope, $uibModalInstance, Auth, $window, 
                                     $state, http, dialogTitle, method) 
  {
    var self = this;
    self.login = 1;
    self.register = 0;
    self.forgot = 0;
    self.verification = 0;
    self.resetPassword_ = 0;
    self.errorMessage = '';
    self.passwords = {};
    self.dialogTitle = dialogTitle;

    if (dialogTitle) {
      self.user = {
        email: Auth.getUserInfo().email
      };
    }

    self.logout = function () {
      $uibModalInstance.close();
      $rootScope.logout();
    }

    self.doLogin = function (userData) {
      return Auth.login(userData.email, userData.password).then(function (res) {
        self.errorMessage = '';
        if (res.statusCode == 250) {
          self.verification = 1;
          self.hpNumber = res.hpNumber.substr(0, 2) + 'xx xxxx ' + res.hpNumber.substr(-4);
          self.login = 0;
        } else if (res.statusCode == 280) {
          self.resetPassword_ = 1;
          self.login = 0;
        } else {
          Auth.staffLogin(userData.password).then(function (res) {
            if (self.dialogTitle) {
              $uibModalInstance.close();
              http.openSessionDialog = false;
              
              if (method == 'GET') {
                $state.reload();
              }
            } else {
              $scope.startPing();

              $state.go('home');
            }
          })
          .catch(function (err) {
            self.errorMessage = err.statusText;
            if (!err.statusText) {
              self.errorMessage = 'Cannot call staff login API. Please check the API status.';
            }
          })
        }
      }).catch(function (err) {
        self.errorMessage = err.statusText;
        if (!err.statusText) {
          self.errorMessage = 'Cannot call login API. Please check the API status.';
        }
      });
    }

    self.checkTAC = function(userData) {
      return Auth.tac(userData.email, userData.tac).then(function (res) {
        Auth.staffLogin(userData.password).then(function (res) {
          $state.go('home');
        })
        .catch(function (err) {
          if (!err.statusText) {
            self.errorMessage = 'Cannot call TAC API. Please check the API status.';
          }
        })
      }).catch(function (err) {
        console.log(err);
        self.errorMessage = "TAC is not correct.";
      })
    }

    self.resetPassword = function () {
      if (!self.passwords.old) {
        self.errorMessage = 'Please type old password.';
        return false;
      } else if (!self.passwords.new) {
        self.errorMessage = 'Please type new password.';
        return false;
      } else if (self.passwords.new != self.passwords.new_) {
        self.errorMessage = 'Passwords are not matching. Please type again.';
        return false;
      } else if (self.passwords.old != self.user.password) {
        self.errorMessage = 'Old password is not correct. Please type again.';
        return false;        
      }

      Auth.resetPassword(self.user.email, self.passwords.new)
      .then(function (data) {
        $state.reload();
      })
      .catch(function (err) {
        self.errorMessage = err.statusText;
      })
    }

    self.searchKeyPressed = function (events) {
      if(event.which == 13) {
        self.doLogin(self.user);
      }
    }

    self.enterTAC = function (event) {
      if(event.which == 13) {
        self.checkTAC(self.user);
      }
    }
  })

  // =========================================================================
  // Header
  // =========================================================================
  .controller('headerCtrl', function($scope, $state, Auth, searchService, $sce) {
    $scope.app.loadChat = true;
    $scope.app.userInfo = Auth.getUserInfo();
    url = '/chat/index.html';
    $scope.app.chat_url = $sce.trustAsResourceUrl(url);

    $scope.app.getCls = function (mitem) {
      var cls = '';
      if (mitem.submenus) {
        cls = 'sub-menu ';
        for (ii in mitem.submenus) {
          stat = mitem.submenus[ii].url.split('.')[0];
          if ($state.includes(stat)) {
            cls += 'active toggled';
            break;
          }
        }
      }

      return cls;
    }

    searchService.getMenu().then(function (data) {
      $scope.app.menu = data;
    });
  })


  //=================================================
  // Profile
  //=================================================

  .controller('profileCtrl', function(Auth, growlService){
    this.userInfo = Auth.getUserInfo();

    this.gender = "female";
    this.birthDay = "23/06/1988";
    this.martialStatus = "Single";
    this.twitter = "@malinda";
    this.twitterUrl = "twitter.com/malinda";
    this.skype = "malinda.hollaway";
    this.addressSuite = "44-46 Morningside Road";
    this.addressCity = "Edinburgh";
    this.addressCountry = "Scotland";

    //Edit
    this.editSummary = 0;
    this.editInfo = 0;
    this.editContact = 0;

    this.submit = function(item, message) {            
      if(item === 'profileSummary') {
          this.editSummary = 0;
      }
      
      if(item === 'profileInfo') {
          this.editInfo = 0;
      }
      
      if(item === 'profileContact') {
          this.editContact = 0;
      }
      
      growlService.growl(message+' has updated Successfully!', 'inverse'); 
    }
  })

  // =========================================================================
  // used in overview, could be replaced soon
  // =========================================================================

  .controller('bestsellingCtrl', function(bestsellingService){
    // Get Best Selling widget Data
    this.img = bestsellingService.img;
    this.name = bestsellingService.name;
    this.range = bestsellingService.range; 
    
    this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
  });

window.preview = function (file) {
  $('#folderControllerWrap').scope().vm.preview(file);
}
