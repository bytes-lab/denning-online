denningOnline
  // =========================================================================
  // Base controller for common functions
  // =========================================================================

  .controller('denningOnlineCtrl', function($timeout, $state, $scope, growlService, $http, $q, searchService, $rootScope, Auth, contactService){
    var self = this;

    $scope.app = { 
      loadChat: false,
      userInfo: null
    };

    this.searchFilterFlex = 20;
    var width = $(window).width();

    if (width < 780)
      this.searchFilterFlex = 50;
    else if (width < 1300)
      this.searchFilterFlex = 33;
    else if (width < 1441)
      this.searchFilterFlex = 25;

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
    // FilterList;
    this.searchFilterCategories = [];
    // By default template has a boxed layout
    this.layoutType = localStorage.getItem('ma-layout-status');
    
    // For Mainmenu Active Class
    this.$state = $state;  
    
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
    
    //Listview menu toggle in small screens
    this.lvMenuStat = false;
    
    //Blog
    this.wallCommenting = [];
    
    this.wallImage = false;
    this.wallVideo = false;
    this.wallLink = false;

    //Skin Switch
    this.currentSkin = 'blue';

    self.getSearchFilterCategories = function () {
      if (self.searchFilterCategories.length > 0) {
        return self.searchFilterCategories;
      } else {
        self.searchFilterCategories = ['loading'];
        if (Auth.isAuthenticated()) {
          searchService.getFilter().then(function (data) {
            self.searchFilterCategories = [];
            data.forEach(function(item){
              self.searchFilterCategories.push(item);
            })
            return self.searchFilterCategories;
          })
        }        
      }
    }
    
    self.states    = [];
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.searchKeyPressed   = searchKeyPressed;
    self.searchFilterChange = searchFilterChange;
    self.newState = newState;
    self.searchRes = [];
    self.selectedItem = '';
    self.currentText = '';    

    function newState(state) {
    }

    function searchKeyPressed(events, item) {
      if(event.which == 13){        
        // hide list for not keyword
        $('#search_filter').focus();
        selectedItemChange(self.selectedItem || self.currentText);
      }
    }

    function searchFilterChange() {
      self.showFilterCategory = false;
      selectedItemChange(self.selectedItem || self.currentText);
    }

    function querySearch (query) {
      self.showFilterCategory = false;

      return searchService.keyword(query).then(function (data) {
        return data;
      });
    }

    function searchTextChange(text) {
      self.selectedSearchCategory = 0;
      self.currentText = {value: text, display: text};
      if (text.trim() == '')
        self.searchRes = [];
    }

    function selectedItemChange(item) {
      self.showFilterCategory = false;

      if(angular.isUndefined(item))
        return;

      searchService.search(item.value, self.selectedSearchCategory).then(function (data) {
        self.searchRes = data;
        if ($state.current.name != 'search')
          $state.go('search');
      });
    }

    /**
     * Build `states` list of key/value pairs
     */ 
    function loadAll() {      
    }

    self.payments = function(item) {
      $state.go('payment-records.list', {fileNo: item.key});
    };

    self.upload = function(item, type) {
      var prefix = '.'+type+'-upload-';
      self.uploadType = type;
      self.item = item;
      self.uploaded = 0;
      angular.element(prefix+item.key).click();
    };

    self.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = typeof file.lastModified === "number" ? new Date(file.lastModified) : file.lastModifiedDate;

      var info = {
        "fileNo1": self.item.key,
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

      contactService.upload(info, self.uploadType).then(function(res) {
        self.uploaded = self.uploaded + 1;
        if (fileList.length == self.uploaded) {
          alert('The file(s) uploaded successfully.');
        }
      })
      .catch(function(err){
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
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  })
  .controller('loginCtrl', function ($rootScope, $scope, Auth, $window, $state, legalFirmService) {
    var self = this;
    self.login = 1;
    self.register = 0;
    self.forgot = 0;
    self.verification = 0;
    self.errorMessage = '';
    
    self.doLogin = function (userData) {
      return Auth.login(userData.email, userData.password)
        .then(function (res) {
          self.errorMessage = '';
          if (res.statusCode == 250) {
            self.verification = 1;
            self.login = 0;
          } else {
            Auth.staffLogin(userData.password)
            .then(function (res) {
              $state.go('home');
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
      return Auth.tac(userData.email, userData.tac)
        .then(function (res) {
          Auth.staffLogin(userData.password)
          .then(function (res) {
            $state.go('home');
          })
          .catch(function (err) {
            if (!err.statusText) {
              self.errorMessage = 'Cannot call TAC API. Please check the API status.';
            }
          })
        })
        .catch(function (err) {
          self.errorMessage = "TAC is not correct.";
        })
    }

    self.searchKeyPressed = function(events) {
      if(event.which == 13){        
        self.doLogin(self.user);
      }
    }
  })

  // =========================================================================
  // Header
  // =========================================================================
  .controller('headerCtrl', function($scope, Auth, searchService){
    $scope.app.loadChat = true;
    $scope.app.userInfo = Auth.getUserInfo();
    $scope.app.chat_url = '/chat/index.html?uid=';

    searchService.getMenu().then(function (data) {
      $scope.app.menu = data;
    });

    if ($scope.app.userInfo != null) {
      $scope.app.chat_url += $scope.app.userInfo.email;
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
  })

  .controller('recentitemCtrl', function(recentitemService){
    
    //Get Recent Items Widget Data
    this.id = recentitemService.id;
    this.name = recentitemService.name;
    this.parseInt = recentitemService.price;
    
    this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
  })
