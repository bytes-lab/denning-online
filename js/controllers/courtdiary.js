denningOnline
  .controller('courtdiaryListCtrl', function($stateParams, NgTableParams, 
                                             courtdiaryService, $state, Auth) {
    var self = this;

    self.userInfo = Auth.getUserInfo();
    self.keyword = $stateParams.keyword;
    self.option = 'today,today,0All';
    self.filter = '0All';
    self.firstDay = moment(new Date()).format('YYYY-MM-DD');
    self.lastDay = moment(new Date()).format('YYYY-MM-DD');

    self.clickHandler = function (item) {
      $state.go('courtdiaries.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25
    }, {
      getData: function(params) {
        return courtdiaryService.getCalendar(self.firstDay, self.lastDay, self.filter, params.page(), 
                                             params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }

    function parseDate(strDate) {
      if (strDate == "today") {
        return moment(new Date()).format('YYYY-MM-DD');
      } else if (strDate == "yesterday") {
        return moment(new Date()).add(-1, 'days').format('YYYY-MM-DD');
      } else {
        return strDate;
      }
    }

    self.changeFilter = function () {
      var option = self.option.split(',');
      self.firstDay = parseDate(option[0]);
      self.lastDay = parseDate(option[1]);
      self.filter = option[2];
      self.tableFilter.reload();
    }

    self.onSelect = function(argStart, argEnd) {
      self.firstDay = argStart.toISOString();
      self.lastDay = moment(argEnd).add(-1, 'days').format('YYYY-MM-DD');
      self.tableFilter.reload();
    }
  })

  .controller('courtdiaryEditCtrl', function($filter, $uibModal, $stateParams, courtdiaryService, 
                                             $state, Auth, $scope, uibDateParser) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;

    if ($stateParams.id) {
      courtdiaryService.getItem($stateParams.id).then(function (item){
        self.courtdiary = item;
        angular.forEach(self.courtdiary, function (value, key) {
          if (key.indexOf('dt') == 0) {
            self.courtdiary[key] = uibDateParser.parse(self.courtdiary[key], 'yyyy-MM-dd HH:mm:ss');
          }
        })
      });
    } else {
      self.courtdiary = {};
    }

    self.save = function () {
      courtdiaryService.save(self.courtdiary).then(function(courtdiary) {
        self.courtdiary = courtdiary;
      })
      .catch(function(err){
        //Handler
      });
    }

    self.cancel = function () {
      $state.go('courtdiary');
    }

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    $scope.format = 'dd/MM/yyyy';

    //Create Modal
    function modalInstances1(animation, size, backdrop, keyboard, contact) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          contact: function () {
            return contact;
          }, 
          on_list: function () {
            return false;
          }
        }
      });
    }

    //Prevent Outside Click
    self.openDelete = function (event, contact) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, contact)
    };
  })
