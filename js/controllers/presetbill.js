denningOnline
  .controller('presetbillListCtrl', function($filter, $uibModal, NgTableParams, presetbillService, $state) {
    var self = this;

    presetbillService.getList(1, 500).then(function(data) {
      self.data = data;
      initializeTable();
    });

    function initializeTable () {
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
  })

  .controller('presetbillEditCtrl', function($filter, $stateParams, presetbillService, $state) {
    var self = this;
    self.isDialog = false;

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
      self.title = 'PRESET BILL EDIT';
      presetbillService.getItem($stateParams.id).then(function (item){
        self.entity = angular.copy(item);
      });
    } else {
      self.title = 'NEW PRESET BILL';
      self.entity = {
        code: 'P' + Math.floor(Math.random() * 1000 + 1),
        state: 'Common',
        category: 'Conveyancing',
      };
    }

    self.save = function () {
      presetbillService.save(self.entity).then(function (presetbill) {
        self.entity = presetbill;
        $state.go('billing.presetbills-list');
      });
    }
  })
