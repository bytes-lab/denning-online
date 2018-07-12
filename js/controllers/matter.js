denningOnline
  .controller('fileMatterListCtrl', function($uibModal, NgTableParams, fileMatterService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.keyword = '';

    self.clickHandler = function (item) {
      $state.go('file-matters.edit', {'fileNo': item.systemNo});
    }

    self.tableFilter = new NgTableParams({
      page: 1,            // show first page
      count: 15,
      sorting: {
        name: 'asc'       // initial sorting
      }
    }, {
      getData: function(params) {
        return fileMatterService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          var data_ = [];
          params.total(data.headers('x-total-count'));
          angular.forEach(data.data, function(value, key) {
            var item = JSON.parse(value.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
            item.dateOpen = item.dateOpen.split(' ')[0];
            data_.push(item);
          });
          return data_;
        });
      }
    })    

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, contact, on_list, fileMatterService, $state) {
    $scope.ok = function () {
      fileMatterService.delete(contact).then(function(contact) {
        if (on_list)
          $state.reload();
        else
          $state.go('file-matters.list');
      })
      .catch(function(err){
        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
      if (on_list)
        $state.go('file-matters.list');
    };
  })

  .controller('matterCodeListCtrl', function(NgTableParams, matterCodeService, $state) {
    var self = this;

    self.clickHandler = function (item) {
      $state.go('matter-codes.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
      sorting: {
        name: 'asc'
      }
    }, {
      getData: function(params) {
        return matterCodeService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('matterCodeEditCtrl', function($filter, $stateParams, matterCodeService, $state, Auth, presetbillService, matterFormService) {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

    self.partyLabels = [
      'Client', 
      'Vendor', 
      'Purchaser', 
      'Borrower', 
      'Guarantor', 
      'Plaintiff', 
      'Defendant', 
      'Assignor', 
      'Assignee',
      'Financing Bank', 
      'Chargee / Assignee Bank', 
      'Landlord', 
      'Tenant', 
      'Lessor', 
      'Lessee', 
      'First Party', 
      'Second Party', 
      'Third Party', 
      'Fourth Party',
      'Fifth Party', 
      'Sixth Party'
    ];

    self.lawyerLabels = [
      'Vendor Solicitors', 
      'Purchaser Solicitors', 
      'Bank Solicitors', 
      'Charger Solicitors', 
      'Plaintiff Solicitors', 
      'Defendant Solicitors', 
      'Third Party Solicitors', 
      'Appellant Solicitors', 
      'Respondent Solicitors'
    ];

    self.bankLabels = [
      'Chargee Bank', 
      'Financing Bank', 
      'Stakeholder Bank', 
      'Developer HDA Bank'
    ];

    self.mattercode = {};   //  temp variable for json fields

    $("#back-top").hide();
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('#back-top').fadeIn();
        $('.btn-balances').fadeIn();
      } else {
        $('#back-top').fadeOut();
        $('.btn-balances').fadeOut();
      }
    });

    presetbillService.getList(1, 500).then(function(data) {
      self.presetBills = data;
    });

    self.scrollUp = function () {
      $('body,html').animate({
          scrollTop : 0
      }, 500);
      return false;
    };

    if ($stateParams.id) {
      matterCodeService.getItem($stateParams.id).then(function(item){
        self.matterCode = item;
        
        angular.forEach(JSON.parse(item.jsonFieldLabels || "{}"), function(value, key) {
          self.mattercode[value.Field] = value;
        })

        // self.mattercode.staff1 = {'Label': 'Partner'};
        // self.mattercode.staff2 = {'Label': 'L.A.'};
        // self.mattercode.staff3 = {'Label': 'Clerk in charge'};
        // self.mattercode.staff4 = {'Label': 'Team'};
      });
    } else {
      self.matterCode = {};
    }

    self.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    self.new_ = function new_() {
      self.matterCode = {};
      self.can_edit = true;
      self.create_new = true;
    }

    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      
      delete self.matterCode.code;
    }

    self.save = function () {
      var selected = [];
      angular.forEach(self.mattercode, function(value, key) {
        selected.push(value);
      })

      self.matterCode.jsonFieldLabels = JSON.stringify(selected);
      matterCodeService.save(self.matterCode).then(function(matterCode) {
        // self.matterCode = matterCode;
        $state.go('matter-codes.edit', {'code': matterCode.code});
      });
    }

    self.cancel = function () {
      $state.go('matter-codes.list');      
    }
    
    self.openDelete = function (event, matterCode) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, matterCode)
    };

    self.queryList = function (labels, q) {
      return labels.filter(function(item) {
        return item.search(new RegExp(q, "i")) > -1;
      });
    };

    self.queryForms = function (searchText) {
      return matterFormService.getList(1, 10, searchText).then(function(data) { return data; });
    };

    self.queryBills = function (searchText) {
      return self.presetBills.filter(function(c) {
        return c.code.search(new RegExp(searchText, "i")) > -1 || c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }

    //Create Modal
    function modalInstances1(animation, size, backdrop, keyboard, matterCode) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          matterCode: function () {
            return matterCode;
          }, 
          on_list: function () {
            return false;
          }
        }
      });
    }
  })
