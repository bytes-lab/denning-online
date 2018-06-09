materialAdmin
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

    this.skinList = [
      'lightblue',
      'bluegray',
      'cyan',
      'teal',
      'green',
      'orange',
      'blue',
      'purple'
    ]

    this.skinSwitch = function (color) {
      this.currentSkin = color;
    }

    searchService.getFilter().then(function (data) {
      self.searchFilterCategories = [];
      data.forEach(function(item){
        self.searchFilterCategories.push(item);
      })
    })
    
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
      var info = {
        "fileNo1": self.item.key,
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
      } else if (item.Title.indexOf('File No') == 0) {
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

    self.templates = function(item) {
      $state.go('file-matters.edit', {'fileNo': item.key});
    }
    
    self.accounts = function(item) {
      $state.go('accounts.list', {fileNo: item.key, fileName: JSON.parse(item.JsonDesc.replace(/[\u0000-\u0019]+/g,"")).primaryClient.name});
    }
    
    self.openFolder = function(code, type) {
      $state.go('folders.list', {id: code, type: type});
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
    
    // legalFirmService.getList().then(function(data) {
    //   self.legalFirms = data;
    // });    
      
    self.doLogin = function (userData) {
      return Auth.login(userData.email, userData.password)
        .catch(function (err) {
          self.errorMessage = err.message;
        })
        .then(function (res) {
          if (res.statusCode == 250) {
            self.verification = 1;
            self.login = 0;
          } else {
            Auth.staffLogin(userData.password)
            .catch(function (err) {
              self.errorMessage = err.message;
            })
            .then(function (res) {
              $state.go('home');
            });
          }
        });
    }

    self.checkTAC = function(userData) {
      return Auth.tac(userData.email, userData.tac)
        .catch(function (err) {
          self.errorMessage = "TAC is not correct.";
        })
        .then(function (res) {
          Auth.staffLogin(userData.password)
          .catch(function (err) {
            self.errorMessage = err.message;
          })
          .then(function (res) {
            $state.go('home');
          });
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
  .controller('headerCtrl', function($timeout, $scope, messageService, Auth){
    $scope.app.loadChat = true;
    $scope.app.userInfo = Auth.getUserInfo();
    $scope.app.chat_url = '/chat/index.html?uid=' + $scope.app.userInfo.email;

    // Top Search
    this.openSearch = function(){
      angular.element('#header').addClass('search-toggled');
      angular.element('#top-search-wrap').find('input').focus();
    }

    this.closeSearch = function(){
      angular.element('#header').removeClass('search-toggled');
    }
    
    // Get messages and notification for header
    this.img = messageService.img;
    this.user = messageService.user;
    this.user = messageService.text;

    this.messageResult = messageService.getMessage(this.img, this.user, this.text);

    //Clear Notification
    this.clearNotification = function($event) {
      $event.preventDefault();
      
      var x = angular.element($event.target).closest('.listview');
      var y = x.find('.lv-item');
      var z = y.size();
      
      angular.element($event.target).parent().fadeOut();
      
      x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
      x.find('.grid-loading').fadeIn(1500);
      var w = 0;
      
      y.each(function(){
        var z = $(this);
        $timeout(function(){
          z.addClass('animated fadeOutRightBig').delay(1000).queue(function(){
            z.remove();
          });
        }, w+=150);
      })
      
      $timeout(function(){
        angular.element('#notifications').addClass('empty');
      }, (z*150)+200);
    }
    
    // Clear Local Storage
    this.clearLocalStorage = function() {
      
      //Get confirmation, if confirmed clear the localStorage
      swal({   
        title: "Are you sure?",   
        text: "All your saved localStorage values will be removed",   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#F44336",   
        confirmButtonText: "Yes, delete it!",   
        closeOnConfirm: false 
      }, function(){
        localStorage.clear();
        swal("Done!", "localStorage is cleared", "success"); 
      });
      
    }
    
    //Fullscreen View
    this.fullScreen = function() {
      //Launch
      function launchIntoFullscreen(element) {
        if(element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      //Exit
      function exitFullscreen() {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }

      if (exitFullscreen()) {
        launchIntoFullscreen(document.documentElement);
      }
      else {
        launchIntoFullscreen(document.documentElement);
      }
    }
  
  })



  // =========================================================================
  // Best Selling Widget
  // =========================================================================

  .controller('bestsellingCtrl', function(bestsellingService){
    // Get Best Selling widget Data
    this.img = bestsellingService.img;
    this.name = bestsellingService.name;
    this.range = bestsellingService.range; 
    
    this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
  })

 
  // =========================================================================
  // Todo List Widget
  // =========================================================================

  .controller('todoCtrl', function(todoService){
    
    //Get Todo List Widget Data
    this.todo = todoService.todo;
    
    this.tdResult = todoService.getTodo(this.todo);
    
    //Add new Item (closed by default)
    this.addTodoStat = false;
  })


  // =========================================================================
  // Recent Items Widget
  // =========================================================================

  .controller('recentitemCtrl', function(recentitemService){
    
    //Get Recent Items Widget Data
    this.id = recentitemService.id;
    this.name = recentitemService.name;
    this.parseInt = recentitemService.price;
    
    this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
  })


  // =========================================================================
  // Recent Posts Widget
  // =========================================================================
  
  .controller('recentpostCtrl', function(recentpostService){
    
    //Get Recent Posts Widget Items
    this.img = recentpostService.img;
    this.user = recentpostService.user;
    this.text = recentpostService.text;
    
    this.rpResult = recentpostService.getRecentpost(this.img, this.user, this.text);
  })


  //=================================================
  // Profile
  //=================================================

  .controller('profileCtrl', function(growlService, Auth){
    
    //Get Profile Information from profileService Service
    
    //User
    this.profile = Auth.getUserInfo();

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



  //=================================================
  // CALENDAR
  //=================================================
  
  .controller('calendarCtrl', function($modal){
  
    //Create and add Action button with dropdown in Calendar header. 
    this.month = 'month';
  
    this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
              '<li class="dropdown" dropdown>' +
                '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
                '<ul class="dropdown-menu dropdown-menu-right">' +
                  '<li class="active">' +
                    '<a data-calendar-view="month" href="">Month View</a>' +
                  '</li>' +
                  '<li>' +
                    '<a data-calendar-view="basicWeek" href="">Week View</a>' +
                  '</li>' +
                  '<li>' +
                    '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
                  '</li>' +
                  '<li>' +
                    '<a data-calendar-view="basicDay" href="">Day View</a>' +
                  '</li>' +
                  '<li>' +
                    '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</li>';

      
    //Open new event modal on selecting a day
    this.onSelect = function(argStart, argEnd) {      
      var modalInstance  = $modal.open({
        templateUrl: 'addEvent.html',
        controller: 'addeventCtrl',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          calendarData: function() {
            var x = [argStart, argEnd];
            return x;
          }
        }
      });
    }
  })

  //Add event Controller (Modal Instance)
  .controller('addeventCtrl', function($scope, $uibModalInstance, calendarData){
    
    //Calendar Event Data
    $scope.calendarData = {
      eventStartDate: calendarData[0],
      eventEndDate:  calendarData[1]
    };
  
    //Tags
    $scope.tags = [
      'bgm-teal',
      'bgm-red',
      'bgm-pink',
      'bgm-blue',
      'bgm-lime',
      'bgm-green',
      'bgm-cyan',
      'bgm-orange',
      'bgm-purple',
      'bgm-gray',
      'bgm-black',
    ]
    
    //Select Tag
    $scope.currentTag = '';
    
    $scope.onTagClick = function(tag, $index) {
      $scope.activeState = $index;
      $scope.activeTagColor = tag;
    } 
    
    //Add new event
    $scope.addEvent = function() {
      if ($scope.calendarData.eventName) {

        //Render Event
        $('#calendar').fullCalendar('renderEvent',{
          title: $scope.calendarData.eventName,
          start: $scope.calendarData.eventStartDate,
          end:  $scope.calendarData.eventEndDate,
          allDay: true,
          className: $scope.activeTagColor

        },true ); //Stick the event

        $scope.activeState = -1;
        $scope.calendarData.eventName = '';   
        $uibModalInstance.close();
      }
    }
    
    //Dismiss 
    $scope.eventDismiss = function() {
      $uibModalInstance.dismiss();
    }
  })

  // =========================================================================
  // COMMON FORMS
  // =========================================================================

  .controller('formCtrl', function(){
  
    //Input Slider
    this.nouisliderValue = 4;
    this.nouisliderFrom = 25;
    this.nouisliderTo = 80;
    this.nouisliderRed = 35;
    this.nouisliderBlue = 90;
    this.nouisliderCyan = 20;
    this.nouisliderAmber = 60;
    this.nouisliderGreen = 75;
  
    //Color Picker
    this.color = '#03A9F4';
    this.color2 = '#8BC34A';
    this.color3 = '#F44336';
    this.color4 = '#FFC107';
  })


  // =========================================================================
  // PHOTO GALLERY
  // =========================================================================

  .controller('photoCtrl', function(){
    
    //Default grid size (2)
    this.photoColumn = 'col-md-2';
    this.photoColumnSize = 2;
  
    this.photoOptions = [
      { value: 2, column: 6 },
      { value: 3, column: 4 },
      { value: 4, column: 3 },
      { value: 1, column: 12 },
    ]
  
    //Change grid
    this.photoGrid = function(size) {
      this.photoColumn = 'col-md-'+size;
      this.photoColumnSize = size;
    }
  
  })


  // =========================================================================
  // ANIMATIONS DEMO
  // =========================================================================
  .controller('animCtrl', function($timeout){
    
    //Animation List
    this.attentionSeekers = [
      { animation: 'bounce', target: 'attentionSeeker' },
      { animation: 'flash', target: 'attentionSeeker' },
      { animation: 'pulse', target: 'attentionSeeker' },
      { animation: 'rubberBand', target: 'attentionSeeker' },
      { animation: 'shake', target: 'attentionSeeker' },
      { animation: 'swing', target: 'attentionSeeker' },
      { animation: 'tada', target: 'attentionSeeker' },
      { animation: 'wobble', target: 'attentionSeeker' }
    ]
    this.flippers = [
      { animation: 'flip', target: 'flippers' },
      { animation: 'flipInX', target: 'flippers' },
      { animation: 'flipInY', target: 'flippers' },
      { animation: 'flipOutX', target: 'flippers' },
      { animation: 'flipOutY', target: 'flippers'  }
    ]
     this.lightSpeed = [
      { animation: 'lightSpeedIn', target: 'lightSpeed' },
      { animation: 'lightSpeedOut', target: 'lightSpeed' }
    ]
    this.special = [
      { animation: 'hinge', target: 'special' },
      { animation: 'rollIn', target: 'special' },
      { animation: 'rollOut', target: 'special' }
    ]
    this.bouncingEntrance = [
      { animation: 'bounceIn', target: 'bouncingEntrance' },
      { animation: 'bounceInDown', target: 'bouncingEntrance' },
      { animation: 'bounceInLeft', target: 'bouncingEntrance' },
      { animation: 'bounceInRight', target: 'bouncingEntrance' },
      { animation: 'bounceInUp', target: 'bouncingEntrance'  }
    ]
    this.bouncingExits = [
      { animation: 'bounceOut', target: 'bouncingExits' },
      { animation: 'bounceOutDown', target: 'bouncingExits' },
      { animation: 'bounceOutLeft', target: 'bouncingExits' },
      { animation: 'bounceOutRight', target: 'bouncingExits' },
      { animation: 'bounceOutUp', target: 'bouncingExits'  }
    ]
    this.rotatingEntrances = [
      { animation: 'rotateIn', target: 'rotatingEntrances' },
      { animation: 'rotateInDownLeft', target: 'rotatingEntrances' },
      { animation: 'rotateInDownRight', target: 'rotatingEntrances' },
      { animation: 'rotateInUpLeft', target: 'rotatingEntrances' },
      { animation: 'rotateInUpRight', target: 'rotatingEntrances'  }
    ]
    this.rotatingExits = [
      { animation: 'rotateOut', target: 'rotatingExits' },
      { animation: 'rotateOutDownLeft', target: 'rotatingExits' },
      { animation: 'rotateOutDownRight', target: 'rotatingExits' },
      { animation: 'rotateOutUpLeft', target: 'rotatingExits' },
      { animation: 'rotateOutUpRight', target: 'rotatingExits'  }
    ]
    this.fadeingEntrances = [
      { animation: 'fadeIn', target: 'fadeingEntrances' },
      { animation: 'fadeInDown', target: 'fadeingEntrances' },
      { animation: 'fadeInDownBig', target: 'fadeingEntrances' },
      { animation: 'fadeInLeft', target: 'fadeingEntrances' },
      { animation: 'fadeInLeftBig', target: 'fadeingEntrances'  },
      { animation: 'fadeInRight', target: 'fadeingEntrances'  },
      { animation: 'fadeInRightBig', target: 'fadeingEntrances'  },
      { animation: 'fadeInUp', target: 'fadeingEntrances'  },
      { animation: 'fadeInBig', target: 'fadeingEntrances'  }
    ]
    this.fadeingExits = [
      { animation: 'fadeOut', target: 'fadeingExits' },
      { animation: 'fadeOutDown', target: 'fadeingExits' },
      { animation: 'fadeOutDownBig', target: 'fadeingExits' },
      { animation: 'fadeOutLeft', target: 'fadeingExits' },
      { animation: 'fadeOutLeftBig', target: 'fadeingExits'  },
      { animation: 'fadeOutRight', target: 'fadeingExits'  },
      { animation: 'fadeOutRightBig', target: 'fadeingExits'  },
      { animation: 'fadeOutUp', target: 'fadeingExits'  },
      { animation: 'fadeOutUpBig', target: 'fadeingExits'  }
    ]
    this.zoomEntrances = [
      { animation: 'zoomIn', target: 'zoomEntrances' },
      { animation: 'zoomInDown', target: 'zoomEntrances' },
      { animation: 'zoomInLeft', target: 'zoomEntrances' },
      { animation: 'zoomInRight', target: 'zoomEntrances' },
      { animation: 'zoomInUp', target: 'zoomEntrances'  }
    ]
    this.zoomExits = [
      { animation: 'zoomOut', target: 'zoomExits' },
      { animation: 'zoomOutDown', target: 'zoomExits' },
      { animation: 'zoomOutLeft', target: 'zoomExits' },
      { animation: 'zoomOutRight', target: 'zoomExits' },
      { animation: 'zoomOutUp', target: 'zoomExits'  }
    ]

    //Animate  
    this.ca = '';
  
    this.setAnimation = function(animation, target) {
      if (animation === "hinge") {
        animationDuration = 2100;
      }
      else {
        animationDuration = 1200;
      }
      
      angular.element('#'+target).addClass(animation);
      
      $timeout(function(){
        angular.element('#'+target).removeClass(animation);
      }, animationDuration);
    }
  
  })

