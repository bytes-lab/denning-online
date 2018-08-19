denningOnline
  .run(function ($rootScope, Auth, $state){
  	$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;


      if (toState.data && toState.data.access) {
        /*Cancel going to the authenticated state and go back to landing*/
        if (toState.data.access == '@' && !Auth.isAuthenticated()) {
          event.preventDefault();
          return $state.go('login');
        }

        if (toState.data.access == '?' && Auth.isAuthenticated()) {
          event.preventDefault();
          return $state.go('home');
        }
      }
    });
  })

  .run(function(formlyConfig, contactService, propertyService, legalFirmService, 
                presetbillService, spaChecklistService, bankBranchService) 
  {
    var attributes = [
      'date-disabled',
      'custom-class',
      'show-weeks',
      'starting-day',
      'init-date',
      'min-mode',
      'max-mode',
      'format-day',
      'format-month',
      'format-year',
      'format-day-header',
      'format-day-title',
      'format-month-title',
      'year-range',
      'shortcut-propagation',
      'datepicker-popup',
      'show-button-bar',
      'current-text',
      'clear-text',
      'close-text',
      'close-on-date-selection',
      'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];
      
    var ngModelAttrs = {};

    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = {attribute: attr};
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = {bound: binding};
    });
      
    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function(match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }    
    
    function getContacts(page, pagesize, keyword) {
      return contactService.getCustomerList(page, pagesize, keyword).then(function(resp) {
        return resp.data;
      });
    }

    function getBankBranches(page, pagesize, keyword) {
      return bankBranchService.getTableList(page, pagesize, keyword).then(function(resp) {
        return resp.data;
      });
    }

    function getStaffs(page, pagesize, keyword) {
      return contactService.getStaffList(1, 10, keyword).then(function(resp) {
        return resp.data;
      });
    }

    function getPresetBills(page, pagesize, keyword) {
      return presetbillService.getTableList(page, pagesize, keyword).then(function(resp) {
        return resp;
      });
    }

    function getPresetChecklist(page, pagesize, keyword) {
      return spaChecklistService.getTableList(page, pagesize, keyword).then(function(resp) {
        return resp;
      });
    }

    function getProperties(page, pagesize, keyword) {
      return propertyService.getTableList(page, pagesize, keyword).then(function(resp) {
        return resp.data;
      });
    }

    function getSolicitors(page, pagesize, keyword) {
      return legalFirmService.getTableList(page, pagesize, keyword).then(function(resp) {
        return resp.data;
      });
    }

    function range (min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
          input.push(i);
      }
      return input;
    }

    // set templates here
    formlyConfig.setType({
      name: 'price_w_currency',
      templateUrl: 'price_w_currency.html'
    });
    
    formlyConfig.setType({
      name: 'group_label',
      templateUrl: 'group_label.html'
    });
    
    formlyConfig.setType({
      name: 'text',
      templateUrl: 'text.html'
    });

    formlyConfig.setType({
      name: 'offer',
      templateUrl: 'offer.html'
    });

    // contact attribute
    formlyConfig.setType({
      name: 'contact',
      templateUrl: 'contact.html',
      controller: function ($scope, legalFirmService, contactService, Auth, $uibModal) {
        $scope.represent_this = $scope.model['strLawyer'+$scope.to.idx+'Ref'] && $scope.model['strLawyer'+$scope.to.idx+'Ref'].indexOf('tmho') > -1;
        $scope.userInfo = Auth.getUserInfo();
        
        $scope.representChange = function() {
          $scope.represent_this = !$scope.represent_this;
          // if ($scope.represent_this && $scope.userInfo.catPersonal.length > 0) {
            // $scope.model['strLawyer'+$scope.to.idx+'Ref'] = $scope.userInfo.catPersonal[0].LawFirm.name;
          if ($scope.represent_this) {
            // 6000-2862/0/tmho/Siti/501
            $scope.model['strLawyer'+$scope.to.idx+'Ref'] = $scope.model.strFileNo1 + "/0/tmho";
          } else {
            $scope.model['strLawyer'+$scope.to.idx+'Ref'] = '';
          }
        }

        $scope.range = function (min, max, step) {
          return range(min, max, step);
        };

        $scope.addParty = function(start, end) {
          var flag = false;
          for(var i = start; i <= end; i++) {
            if (!$scope.model.tmp['clsC'+i] && !$scope.model['clsC'+i].code) {
              $scope.model.tmp['clsC'+i] = true;
              flag = true;
              break;
            }
          }
          if (!flag) {
            alert('Sorry, you cannot add more party!');
          }
        }

        $scope.removeParty = function(idx, start, end) {
          var last = end;
          for(var i = idx; i < end; i++) {           // shift 
            if (!$scope.model['clsC'+(i+1)].code && !$scope.model.tmp['clsC'+(i+1)]) {
              last = i;
              break;
            }
            $scope.model['clsC'+i] = $scope.model['clsC'+(i+1)];
            $scope.model.tmp['clsC'+i] = $scope.model.tmp['clsC'+(i+1)];
          }
          $scope.model.tmp['clsC'+last] = false;
          $scope.model['clsC'+last] = {};
        }

        $scope.viewContact = function(party) {
          if (party) {
            $scope.contactDialog(party, true);
          } else {
            alert('Please select a party.')
          }
        }

        $scope.viewLegalFirm = function(party) {
          if (party) {
            $scope.legalfirmDialog(party, true);
          } else {
            alert('Please select a solicitor.')
          }
        }

        $scope.queryContacts = function(searchText) {
          return getContacts(1, 10, searchText);
        }

        $scope.queryLFs = function(searchText) {
          return getSolicitors(1, 10, searchText);
        }

        //Create Contact Modal
        $scope.contactDialog = function(party, viewMode) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/contact-edit.html',
            controller: 'contactCreateModalCtrl',
            controllerAs: 'vm',
            size: 'lg',
            backdrop: 'static',
            keyboard: true,
            resolve: {
              viewMode: viewMode,
              party: party
            }      
          });

          modalInstance.result.then(function(contact){
            if (contact) {  // should be integrated with service
              party.party = contact;
              $scope.contacts.push(contact);
            }
          })
        }

        //Create legal firm Modal
        $scope.legalfirmDialog = function(lf, viewMode) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/legal-firm-edit.html',
            controller: 'lfCreateModalCtrl',
            controllerAs: 'vm',
            size: 'lg',
            backdrop: 'static',
            keyboard: true,
            resolve: {
              viewMode: viewMode,
              lf: lf
            }      
          });

          modalInstance.result.then(function(lf_){
            if (lf_) {  // should be integrated with service
              lf.party = lf_;
              $scope.legalFirms.push(lf_);
            }
          })
        }
      }
    });
    
    // property attribute
    formlyConfig.setType({
      name: 'property',
      templateUrl: 'property.html',
      controller: function ($scope, propertyService, Auth, $uibModal) {        
        function initProperty(item) {
          if (item && item.code) {
            propertyService.getItem(item.code)
            .then(function(item) {
              $scope.property = item;
            });
          } else {
            $scope.property = {};
          }          
        }

        initProperty($scope.model.clsP1);

        $scope.propertyChange = function (item, n) {
          if (n == 1) {
            initProperty(item);
          }
        };

        $scope.range = function (min, max, step) {
            return range(min, max, step);
        };

        $scope.addProperty = function(start, end) {
          var flag = false;
          for(var i = start; i <= end; i++) {
            if (!$scope.model.tmp['clsP'+i] && !$scope.model['clsP'+i].code) {
              $scope.model.tmp['clsP'+i] = true;
              flag = true;
              break;
            }
          }
          if (!flag) {
            alert('Sorry, you cannot add more property!');
          }
        }

        $scope.removeProperty = function(idx, start, end) {
          var last = end;
          for(var i = idx; i < end; i++) {           // shift 
            if (!$scope.model['clsP'+(i+1)].code && !$scope.model.tmp['clsP'+(i+1)]) {
              last = i;
              break;
            }
            $scope.model['clsP'+i] = $scope.model['clsP'+(i+1)];
            $scope.model.tmp['clsP'+i] = $scope.model.tmp['clsP'+(i+1)];
          }
          $scope.model.tmp['clsP'+last] = false;
          $scope.model['clsP'+last] = {};
        }

        $scope.viewProperty = function(property) {
          if (property && property.code) {
            $scope.propertyDialog(property, true);
          } else {
            alert('Please select a property.')
          }
        }

        $scope.queryProperties = function(searchText) {
          return getProperties(1, 10, searchText);
        }

        //Create Property Modal
        $scope.propertyDialog = function(property, viewMode) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/property-edit.html',
            controller: 'propertyCreateModalCtrl',
            controllerAs: 'vm',
            size: 'lg',
            backdrop: 'static',
            keyboard: true,
            resolve: {
              viewMode: viewMode,
              property: property
            }      
          });

          modalInstance.result.then(function(property){
            if (property) {  // should be integrated with service
              property.property = property;
              $scope.properties.push(property);
            }
          })
        }
      }
    });

    // file attribute
    formlyConfig.setType({
      name: 'file',
      templateUrl: 'file.html',
      controller: function ($scope, legalFirmService, contactService, matterCodeService, Auth, $uibModal, $filter) {
        $scope.userInfo = Auth.getUserInfo();

        $scope.viewContact = function(party) {
          if (party) {
            $scope.contactDialog(party, true);
          } else {
            alert('Please select a party.')
          }
        }

        $scope.queryContacts = function(searchText) {
          return getContacts(1, 10, searchText);
        }

        $scope.queryStaffs = function (searchText) {
          return getStaffs(1, 10, searchText);
        }

        $scope.queryCodes = function(searchText) {
          return matterCodeService.getList(1, 10, searchText).then(function (data) {
            return data.data;
          });
        }

        $scope.matterCodeChange = function (item) {
          if (item && $scope.model.clsMatterCode != $scope.model.tmp.oldMatterCode) {
            if (confirm('Are you sure to change the matter code? \n Changing matter code could lead to change of tabs.')) {
              $scope.model.tmp.matterCodeChange(item);
              $scope.model.tmp.oldMatterCode = item;
            } else {
              $scope.model.clsMatterCode = $scope.model.tmp.oldMatterCode;
            }
          }
        }

        $scope.queryBills = function (searchText) {
          return getPresetBills(1, 10, searchText);
        }

        $scope.queryChecklist = function (searchText) {
          return getPresetChecklist(1, 10, searchText);
        }

        legalFirmService.getList().then(function(resp) {
          $scope.legalFirms = resp.data;
        });

        $scope.contactDialog = function(party, viewMode) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/contact-edit.html',
            controller: 'contactCreateModalCtrl',
            controllerAs: 'vm',
            size: 'lg',
            backdrop: 'static',
            keyboard: true,
            resolve: {
              viewMode: viewMode,
              party: party
            }
          });
        }
      }
    });

    // case attribute
    formlyConfig.setType({
      name: 'case',
      templateUrl: 'case.html',
      controller: ['$scope', 'legalFirmService', 'contactService', 'Auth', '$uibModal', function ($scope, legalFirmService, contactService, Auth, $uibModal) {
        initContacts();

        $scope.getNumber = function(num) {
          return new Array(num);   
        }

        $scope.represent_this = false;
        $scope.userInfo = Auth.getUserInfo();

        $scope.solicitor = {};

        $scope.changeSolicitor = function(item) {
          $scope.solicitor = item;
        }

        $scope.viewContact = function(party) {
          if (party.party) {
            $scope.contactDialog(party, true);
          } else {
            alert('Please select a party.')
          }
        }

        $scope.removeParty = function(idx) {
          if ($scope.model[$scope.options.key].length > 1)
            $scope.model[$scope.options.key].splice(idx, 1);
        }

        function initContacts() {
          contactService.getList().then(function(data) {
            $scope.contacts = data;
          });
        }

        $scope.queryContacts = function(searchText) {
          return $scope.contacts.filter(function(c) {
            return c && (c.name.search(new RegExp(searchText, "i")) > -1 || c.IDNo.search(new RegExp(searchText, "i")) > -1);
          });
        }

        legalFirmService.getList().then(function(data) {
          $scope.legalFirms = data;
        });

        //Create Modal
        $scope.contactDialog = function(party, viewMode) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/contact-edit.html',
            controller: 'contactCreateModalCtrl',
            controllerAs: 'vm',
            size: 'lg',
            backdrop: 'static',
            keyboard: true,
            resolve: {
              viewMode: viewMode,
              party: party,
              initContacts: function(){
                return initContacts;
              }
            }
          });

          modalInstance.result.then(function(contact){
            $scope.contacts.push(contact);
          })
        }

      }]
    });

    // price attribute
    formlyConfig.setType({
      name: 'price',
      templateUrl: 'price.html',
      controller: function ($scope, $timeout, refactorService) {

        $scope.calcForm = function (model) {
          $timeout(function () {
            var v1 = refactorService.convertFloat(angular.element('.rm1').val()),
                v3 = refactorService.convertFloat(angular.element('.rm3').val()),
                v17 = refactorService.convertFloat(angular.element('.rm17').val()),
                v20 = refactorService.convertFloat(angular.element('.rm20').val()),
                v21 = refactorService.convertFloat(angular.element('.rm21').val());

            model.decRM18 = refactorService.formatFloat(v1*0.1-v17);
            v18 = refactorService.convertFloat(model.decRM18);
            model.decRM2 = refactorService.formatFloat(v17+v18);
            v2 = refactorService.convertFloat(model.decRM2);
            model.decRM19 = refactorService.formatFloat(v1-v2);
            model.decRM22 = refactorService.formatFloat(v1+v3+v20+v21);
          }, 200);
        }
      }
    });  

    // loan attribute
    formlyConfig.setType({
      name: 'loan',
      templateUrl: 'loan.html'
    });  

    formlyConfig.setType({
      name: 'premises-rent',
      templateUrl: 'premises-rent.html',
      controller: function ($scope) {
        $scope.types = ['Dwelling House', 'Apartment', 'Condominium', 'Shop', 'Office', 
                        'Factory', 'Workshop', 'Land'];
        $scope.queryList = function (q) {
          return $scope.types.filter(function(item) {
            return item.search(new RegExp(q, "i")) > -1;
          });
        };
      }
    });  

    formlyConfig.setType({
      name: 'term',
      templateUrl: 'term.html'
    });  

    formlyConfig.setType({
      name: 'rpgt',
      templateUrl: 'rpgt.html'
    });  

    formlyConfig.setType({
      name: 'arrear',
      templateUrl: 'arrear.html'
    });  

    formlyConfig.setType({
      name: 'chain',
      templateUrl: 'chain.html'
    });  

    formlyConfig.setType({
      name: 'beneficiary',
      templateUrl: 'beneficiary.html'
    });  

    formlyConfig.setType({
      name: 'other',
      templateUrl: 'other.html'
    });  

    formlyConfig.setType({
      name: 'report',
      templateUrl: 'report.html'
    });  

    formlyConfig.setType({
      name: 'tenancy',
      templateUrl: 'tenancy.html'
    });  

    formlyConfig.setType({
      name: 'vehicle',
      templateUrl: 'vehicle.html'
    });  

    formlyConfig.setType({
      name: 'estate-agent',
      templateUrl: 'estate-agent.html'
    });  

    // legal firm attribute
    formlyConfig.setType({
      name: 'legalFirm',
      templateUrl: 'legalFirm.html',
      controller: ['$scope', function ($scope) {
        legalFirmService.getList().then(function(data) {
          $scope.legalFirms = data;
          $scope.dataReady = true;
        });
      }]
    });

    // bank group
    function bankCtrl ($scope, $uibModal) {
      $scope.queryBanks = function(searchText) {
        return getBankBranches(1, 10, searchText)
      };

      $scope.viewBankBranch = function(branch) {
        if (branch) {
          $scope.bankDialog(branch, true);
        } else {
          alert('Please select a branch.')
        }
      };

      $scope.bankDialog = function(party, viewMode) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/bank-branch-edit.html',
          controller: 'bankBranchCreateModalCtrl',
          controllerAs: 'vm',
          size: 'lg',
          backdrop: 'static',
          keyboard: true,
          resolve: {
            viewMode: viewMode,
            party: party
          }      
        });
      };

      $scope.bankCACDialog = function(party, viewMode) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/bank-CAC-edit.html',
          controller: 'bankCACCreateModalCtrl',
          controllerAs: 'vm',
          size: 'lg',
          backdrop: 'static',
          keyboard: true,
          resolve: {
            viewMode: viewMode,
            party: party
          }      
        });
      };
    }

    formlyConfig.setType({
      name: 'bank1',
      templateUrl: 'bank1.html',
      controller: bankCtrl
    });

    // bank group
    formlyConfig.setType({
      name: 'bank2',
      templateUrl: 'bank2.html',
      controller: bankCtrl
    });

    // gen-doc attribute
    formlyConfig.setType({
      name: 'gen-doc',
      templateUrl: 'gen-doc.html',
      controller: function($scope, $filter, NgTableParams, templateService, $uibModal) {
        $scope.sources = ['All', 'Online', 'User'];        
        $scope.docInfo = {
          fileno: $scope.model.strFileNo1,
          source: 'All'
        };

        $scope.chooseTemplate = function (tpl) {
          $scope.tpl = tpl;
        };

        $scope.generate = function () {
          if (!$scope.tpl) {
            alert("Please choose a template.");
            return false;
          }

          templateService.generateDoc($scope.tpl).then(function (data) {
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'preview-doc.html',
              controller: function ($scope, $sce) {
                var url = `https://docs.google.com/gview?url=https://denningchat.com.my/denningwcf/${ data }&embedded=true`;
                $scope.url = $sce.trustAsResourceUrl(url);
              },
              size: 'lg',
              keyboard: true
            });
          })
        }

        $scope.updateTemplates = function() {
          $scope.tableFilter = new NgTableParams({
            page: 1,
            count: 15,
            sorting: {
              name: 'asc'
            }
          }, {
            getData: function(params) {
              return templateService.getTemplates($scope.docInfo, params.page(), params.count(), $scope.keyword).then(function(data) {
                params.total(data.headers('x-total-count'));
                return data.data;
              });
            }
          })
        };

        $scope.updateType = function() {
          templateService.getTypes($scope.docInfo.category).then(function (data) {
            $scope.types = data;
            $scope.docInfo.type = data[0].strTypeCode;
            $scope.updateTemplates();
          });
        }

        templateService.getCategories().then(function(data) {
          $scope.categories = data;
          $scope.docInfo.category = data[0];
          $scope.updateType();
        });
      }
    });
    
    formlyConfig.setType({
      name: 'datepicker',
      templateUrl:  'datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
          format: 'MM.dd.yyyy',
          initDate: new Date()
          }
        }
      },
      controller: ['$scope', function ($scope) {
        $scope.datepicker = {};
      
        $scope.datepicker.opened = false;  

        $scope.datepicker.open = function ($event) {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });
  })

  .run(function ($rootScope, formlyConfig, overviewService) {
    overviewService.getWidgetList().then(function (data) {
      $rootScope.overviewWidgets = data;

      for (ii in data) {
        formlyConfig.setType({
          name: data[ii].name,
          templateUrl: `widget_t${data[ii].type}.html`,
          controller: function ($scope, overviewService) {
            overviewService.getWidget($scope.to.api).then(function (data) {
              $scope.data = data;
            });
          } 
        });
      }
    })
  })
