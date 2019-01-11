denningOnline
  .controller('matterCodeListCtrl', function(NgTableParams, matterCodeService, $state) {
    var self = this;

    self.clickHandler = function (item) {
      $state.go('matter-codes.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({}, {
      getData: function(params) {
        return matterCodeService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword='';
        }
        self.tableFilter.reload();
      }
    }
  })

  .controller('matterCodeEditCtrl', function($filter, $uibModal, $stateParams, Auth, spaChecklistService,
                                             presetbillService, matterFormService, $state,
                                             matterCodeService, refactorService, growlService, 
                                             $uibModalInstance, entityCode, isDialog, isNew) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'matter-code';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.partyLabels = [
      'Client', 
      'Vendor', 
      'Purchaser', 
      'Borrower', 
      'Chargor',
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

    self.staffLevel1 = [
      'Senior Partner', 
      'Maganing Partner', 
      'Partner', 
      'Directors', 
      'Senior Management', 
      'Level 1 staff', 
      'Supervisor', 
      'Manager', 
      'President'
    ];

    self.staffLevel2 = [
      'Partner', 
      'Director', 
      'Senior Management', 
      'Level 2 staff', 
      'Supervisor', 
      'Manager', 
      'Legal Assistant', 
      'Associate',
      'Senior clerk'
    ];

    self.staffLevel3 = [
      'Legal Assistant', 
      'Supervisor', 
      'Senior clerk', 
      'Legal clerk', 
      'Clerk', 
      'Supporting staff', 
      'Level 3 staff'
    ];

    self.staffLevel4 = [
      'Team',
      'Group',
      'Practice Group',
      'Committee',
      'Sub-committee'
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

    matterCodeService.getCategories().then(function(data) {
      self.categories = data;
    });

    matterCodeService.getDepartments().then(function(data) {
      self.departments = data;
    });

    matterCodeService.getIndustries().then(function(data) {
      self.industries = data;
    });

    self.scrollUp = function () {
      $('body,html').animate({
          scrollTop : 0
      }, 500);
      return false;
    };

    if (self.entityCode) {
      self.title = 'Edit Matter Code';
      matterCodeService.getItem(self.entityCode).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.popoutUrl = $state.href('matter-codes.edit', { id: self.entity.code });
        
        angular.forEach(JSON.parse(item.jsonFieldLabels || "{}"), function(value, key) {
          self.mattercode[value.Field] = value;
        })

        if (self.entity.strCategory) {
          self.strCategory = { strCategory: self.entity.strCategory };
        }

        if (self.entity.strDept) {
          self.strDept = { strDescription: self.entity.strDept };
        }

        if (self.entity.strIndustry) {
          self.strIndustry = { description: self.entity.strIndustry };
        }

        if (self.entity.clsPresetBill && self.entity.clsPresetBill.code) {
          self.clsPresetBill = {
            code: self.entity.clsPresetBill.code,
            description: self.entity.clsPresetBill.strDescription
          }
        }

        if (self.isDialog) {
          self.copy();
        }
      });
    } else {
      self.title = 'New Matter Code';
      self.entity = {};
      self.mattercode = {
        PartnerInCharge: { Field: 'PartnerInCharge', Label: 'Partner' },
        LAInCharge: { Field: 'LAInCharge', Label: 'Legal Assistant' },
        ClerkInCharge: { Field: 'ClerkInCharge', Label: 'Legal clerk' },
        StaffInCharge4: { Field: 'StaffInCharge4', Label: 'Team' }
      }
      self.popoutUrl = $state.href('matter-codes.new');
    }

    self.categoryChange = function (item) {
      if (item) {
        self.entity.strCategory = item.strCategory;
      }
    }

    self.deptChange = function (item) {
      if (item) {
        self.entity.strDept = item.strDescription;
      }
    }

    self.industryChange = function (item) {
      if (item) {
        self.entity.strIndustry = item.description;
      }
    }

    self.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'clsEnteredBy', 'clsUpdatedBy', 'strDescription'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      var selected = [];
      angular.forEach(self.mattercode, function(value, key) {
        value.Field = key;
        selected.push(value);
      })

      self.entity.jsonFieldLabels = JSON.stringify(selected);

      entity = refactorService.getDiff(self.entity_, self.entity);
      matterCodeService.save(entity).then(function (entity) {
        if (entity) {
          if (self.isDialog) {
            $uibModalInstance.close(entity);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('matter-codes.edit', { 'id': entity.code });
            }
            growlService.growl('Saved successfully!', 'success');
          }
        }
      });
    }

    self.cancel = function () {
      if (self.isDialog) {
        $uibModalInstance.close();
      } else {
        $state.go('matter-codes.list');
      }
    }

    self.openDelete = function (event, entity) {
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
            return 'matter code';
          },
          service: function () {
            return matterCodeService;
          },
          return_state: function () {
            return 'matter-codes.list';
          }
        }
      });
    };

    self.queryList = function (labels, q, obj, attr) {
      var arr = labels.filter(function(item) {
        return item.search(new RegExp(q, "i")) > -1;
      });

      if (arr && arr.length == 0) {
        obj[attr] = q;
        return [q];
      } else {
        return arr;
      }
    };

    self.queryForms = function (searchText) {
      return matterFormService.getList(1, 10, searchText, '360').then(function (resp) {
        return resp.data; 
      });
    };

    self.queryChecklist = function (searchText) {
      return spaChecklistService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    };

    self.preBillChange = function (item) {
      if (item) {
        self.entity.clsPresetBill = {
          code: item.code,
          strDescription: item.description
        }
      }
    }

    self.queryBills = function (searchText) {
      return self.presetBills.filter(function(c) {
        return c.code.search(new RegExp(searchText, "i")) > -1 || 
               c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }
  })
