materialAdmin
  .controller('presetbillListCtrl', function($filter, $uibModal, NgTableParams, presetbillService, $state) {
    var self = this;
    self.dataReady = false;
    self.openDelete = openDelete;
    self.clickHandler = clickHandler;

    presetbillService.getList(1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });
    
    function clickHandler(item) {
      $state.go('presetbills.edit', {'id': item.code});
    }

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        dataset: self.data
      })    
    }

    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, presetbill) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'PresetbillDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          presetbill: function () {
            return presetbill;
          }
        }      
      });
    }

    //Prevent Outside Click
    function openDelete(presetbill) {
      modalInstances(true, '', 'static', true, presetbill)
    };    
  })

  .controller('PresetbillDeleteModalCtrl', function ($scope, $uibModalInstance, presetbill, presetbillService, $state) {
    $scope.ok = function () {
      presetbillService.delete(presetbill).then(function(presetbill) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.presetbillInfo.$error.push({meessage:''});
      });
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
      $state.go('presetbills.list');
    };
  })

  .controller('presetbillEditCtrl', function($filter, $stateParams, presetbillService, $state) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.states = [
      'Common',
      'Johor',
      'Kedah',
      'Kelantan',
      'Kuala Lumpur',
      'Malacca',
      'Negeri Sembilan',
      'Pahang',
      'Perak',
      'Perlis',
      'Penang',
      'Sabah',
      'Sarawk',
      'Selangor',
      'Terengganu'
    ];

    self.categories = [
      'Conveyancing',
      'Agreement',
      'Litigation',
      'Will',
      'Estate Admin',
      'Tenancy',
      'Discharge of Charge',
      'Divorce',
      'Corporate Secretarial',
      'General',
      'Common'
    ];
    if ($stateParams.id) {
      presetbillService.getItem($stateParams.id)
      .then(function(item){
        self.presetbill = angular.copy(item);  // important
      });
    } else {
      self.presetbill = {
        code: 'P' + Math.floor(Math.random() * 1000 + 1),
        state: 'Common',
        category: 'Conveyancing',
      };
    }

    function save() {
      presetbillService.save(self.presetbill).then(function(presetbill) {
        self.presetbill = presetbill;
        $state.go('presetbills.list');
      })
      .catch(function(err){
        //Handler
      });
    }

    function cancel() {
      $state.go('presetbills.list');      
    }
  })
