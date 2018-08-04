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

  .controller('courtdiaryEditCtrl', function($filter, $uibModal, $stateParams, refactorService, courtdiaryService, 
                                             $state, Auth, $scope, growlService) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;

    if ($stateParams.id) {
      courtdiaryService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.entity = {};
    }

    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'dtPreviousDate', 'clsEnteredBy',
                        'clsUpdatedBy'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      courtdiaryService.save(entity).then(function (entity) {
        if (self.entity_) {
          $state.reload();
        } else {
          $state.go('courtdiaries.edit', { 'id': entity.code });
        }
        growlService.growl('Saved successfully!', 'success');
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

    //Prevent Outside Click
    self.openDelete = function (event, contact) {
      event.stopPropagation();
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'deleteEntityModal.html',
        controller: 'deleteEntityModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          entity: function () {
            return entity;
          }, 
          on_list: function () {
            return false;
          },
          entity_type: function () {
            return 'court diary';
          },
          service: function () {
            return courtdiaryService;
          },
          return_state: function () {
            return 'courtdiaries.list';
          }
        }
      });
    };
  })
