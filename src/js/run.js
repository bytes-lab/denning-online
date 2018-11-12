denningOnline
  .run(function ($rootScope, Auth, $state) {
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

  .run(function($uibModal, formlyConfig, contactService, propertyService, legalFirmService, 
                presetbillService, spaChecklistService, bankBranchService) 
  {
    function getContacts(page, pagesize, keyword) {
      return contactService.getCustomerList(page, pagesize, keyword).then(function (resp) {
        return resp.data;
      });
    }

    function getBankBranches(page, pagesize, keyword) {
      return bankBranchService.getTableList(page, pagesize, keyword).then(function (resp) {
        return resp.data;
      });
    }

    function getStaffs(page, pagesize, keyword) {
      return contactService.getStaffList(1, 10, keyword).then(function (resp) {
        return resp.data;
      });
    }

    function getPresetBills(page, pagesize, keyword) {
      return presetbillService.getTableList(page, pagesize, keyword).then(function (resp) {
        return resp;
      });
    }

    function getPresetChecklist(page, pagesize, keyword) {
      return spaChecklistService.getTableList(page, pagesize, keyword).then(function (resp) {
        return resp;
      });
    }

    function getProperties(page, pagesize, keyword) {
      return propertyService.getTableList(page, pagesize, keyword).then(function (resp) {
        return resp.data;
      });
    }

    function getSolicitors(page, pagesize, keyword) {
      return legalFirmService.getTableList(page, pagesize, keyword).then(function (resp) {
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

    formlyConfig.setType({
      name: 'offer',
      templateUrl: 'offer.html'
    });

    function contactDialog (model, key, viewMode) {
      if (viewMode && (!model[key] || !model[key].code)) {
        alert('Please select a party.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entity-modal.html',
        controller: 'contactEditCtrl',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          isNew: !viewMode,
          entityCode: function () {
            return viewMode ? model[key].code : null;
          },
          isDialog: true
        }
      });

      modalInstance.result.then(function (contact) {
        if (!viewMode && contact) {
          model[key] = {
            code: contact.code,
            strCitizenship: contact.strCitizenship,
            strIDNo: contact.strIDNo,
            strName: contact.strName
          };
        }
      })
    }

    function solicitorDialog (model, key, viewMode) {
      if (viewMode && (!model[key] || !model[key].code)) {
        alert('Please select a lawyer.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entity-modal.html',
        controller: 'legalFirmEditCtrl',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          isNew: !viewMode,
          entityCode: function () {
            return viewMode ? model[key].code : null;
          },
          isDialog: true
        }
      });

      modalInstance.result.then(function (entity) {
        if (!viewMode && entity) {
          model[key] = {
            code: entity.code,
            strCity: entity.strCity,
            strEmailAddress: entity.strEmailAddress,
            strPhone1: entity.strPhone1,
            strPhone2: entity.strPhone2,
            strPhoneMobile: entity.strPhoneMobile,
            strName: entity.strName
          };
        }
      })
    }

    // contact attribute
    formlyConfig.setType({
      name: 'contact',
      templateUrl: 'contact.html',
      controller: function ($scope, legalFirmService, contactService, Auth, $uibModal) {
        $scope.userInfo = Auth.getUserInfo();

        $scope.shareList = ['1/1', '1/2', '1/3', '1/4', '1/5', '1/10'];
        $scope.represent_this = $scope.userInfo.catDenning.length > 0 && $scope.model[$scope.to.field] &&
                                $scope.model[$scope.to.field].code == $scope.userInfo.catDenning[0].LawFirm.code;
        $scope.representChange = function() {
          $scope.represent_this = !$scope.represent_this;
          if ($scope.represent_this && $scope.userInfo.catDenning.length > 0) {
            $scope.model[$scope.to.field] = {
              code: $scope.userInfo.catDenning[0].LawFirm.code,
              strCity: $scope.userInfo.catDenning[0].LawFirm.address.city,
              strEmailAddress: $scope.userInfo.catDenning[0].LawFirm.emailAddress,
              strName: $scope.userInfo.catDenning[0].LawFirm.name,
              strPhone1: $scope.userInfo.catDenning[0].LawFirm.phoneHome,
              strPhone2: $scope.userInfo.catDenning[0].LawFirm.phoneFax,
              strPhoneMobile: $scope.userInfo.catDenning[0].LawFirm.phoneMobile,
            }
          } else {
            $scope.model[$scope.to.field] = { };
          }
        }

        $scope.range = function (min, max, step) {
          return range(min, max, step);
        };

        if ($scope.to.party) {
          for (var i = $scope.to.c_start; i <= $scope.to.c_end; i++) {
            if ($scope.model['clsC'+i] && $scope.model['clsC'+i].code) {
              $scope.model.tmp['clsC'+i] = true;
            }
          }
        }

        $scope.addParty = function(start, end) {
          var flag = false;
          for(var i = start; i <= end; i++) {
            if (!$scope.model.tmp['clsC'+i] && (!$scope.model['clsC'+i] || !$scope.model['clsC'+i].code)) {
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

        $scope.queryShares = function (q) {
          var arr = $scope.shareList.filter(function (item) {
            return item.search(new RegExp(q, "i")) > -1;
          });

          if (arr && arr.length == 0) {
            return [q];
          } else {
            return arr;
          }
        };

        $scope.queryContacts = function(searchText) {
          return getContacts(1, 10, searchText);
        }

        $scope.queryLFs = function(searchText) {
          return getSolicitors(1, 10, searchText);
        }

        $scope.contactDialog = function(key, viewMode) {
          contactDialog($scope.model, key, viewMode);
        }

        $scope.solicitorDialog = function(key, viewMode) {
          solicitorDialog($scope.model, key, viewMode);
        }
      }
    });
    
    // property attribute
    formlyConfig.setType({
      name: 'property',
      templateUrl: 'property.html',
      controller: function ($scope, propertyService, $uibModal) {        
        function initProperty(item) {
          if (item && item.code) {
            propertyService.getItem(item.code).then(function (item) {
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
            if (!$scope.model.tmp['clsP'+i] && (!$scope.model['clsP'+i] || !$scope.model['clsP'+i].code)) {
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

        $scope.queryProperties = function(searchText) {
          return getProperties(1, 10, searchText);
        }

        //Create Property Modal
        $scope.propertyDialog = function(key, viewMode) {
          if (viewMode && !$scope.model[key].code) {
            alert('Please select a property.');
            return false;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/property-edit.html',
            controller: 'propertyEditCtrl',
            controllerAs: 'vm',
            size: 'lg',
            backdrop: 'static',
            keyboard: true,
            resolve: {
              isNew: !viewMode,
              entityCode: function () {
                return viewMode ? $scope.model[key].code : null;
              },
              isDialog: true
            }      
          });

          modalInstance.result.then(function (property) {
            if (!viewMode && property) {
              $scope.model[key] = {
                code: property.code,
                strAddress: property.strAddress,
                strLotPTNo: property.strLotPTNo,
                strLotType: property.strLotType,
                strPropertyAdr: property.strPropertyAdr,
                strTitleNo: property.strTitleNo,
                strTitleType: property.strTitleType
              };
            }
          })
        }
      }
    });

    // file attribute
    formlyConfig.setType({
      name: 'info',
      templateUrl: 'info.html',
      controller: function ($scope, legalFirmService, matterCodeService, Auth, $uibModal, 
                            matterService) 
      {
        $scope.userInfo = Auth.getUserInfo();

        if ($scope.model.strRelatedFile) {
          $scope.rmatter = {
            Title: ': ' + $scope.model.strRelatedFile
          }
        }

        matterService.getFileStatusList().then(function (resp) {
          $scope.fileStatus = resp.data;
        });

        $scope.open = function($event, opened) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope[opened] = true;
        };

        $scope.queryMatters = function (search) {
          return matterService.getList(1, 5, search).then(function (resp) {
            return resp.data
          })
        }

        $scope.queryBranch = function (search) {
          return matterService.getProgramOwnerList(1, 5, search).then(function (resp) {
            return resp.data
          })
        }

        $scope.matterChange = function (matter) {
          if (matter) {
            $scope.model.strRelatedFile = matter.key;
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
            if (!$scope.model.strFileNo1 || confirm('Are you sure to change the matter code? \nChanging matter ' + 
                        'code could lead to change of tabs.')) {
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

        $scope.contactDialog = function(key, viewMode) {
          contactDialog($scope.model, key, viewMode);
        }
      }
    });

    // case attribute
    formlyConfig.setType({
      name: 'case',
      templateUrl: 'case.html',
      controller: function ($scope, caseService, judgeService) {
        if ($scope.model.strF2) {
          $scope.court = { strTypeE: $scope.model.strF2 };
        }

        if ($scope.model.strF3) {
          $scope.caseType = { strEnglish: $scope.model.strF3 };
        }

        if ($scope.model.strF6) {
          $scope.sar = { strName: $scope.model.strF6 };
        }

        if ($scope.model.strF7) {
          $scope.judge = { strName: $scope.model.strF7 };
        }

        $scope.queryCaseTypes = function (searchText) {
          return caseService.getList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.queryCourts = function (searchText) {
          return caseService.getCourtList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.queryJudges = function (searchText) {
          return judgeService.getList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.querySAR = function (searchText) {
          return judgeService.getSARList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.courtChange = function (item) {
          $scope.model.strF1 = null;
          $scope.model.strF2 = null;
          if (item) {
            $scope.model.strF1 = item.code;
            $scope.model.strF2 = item.strTypeE;
            $scope.model.strF8 = item.strPlace + ',' + item.strState;
          }
        }

        $scope.caseTypeChange = function (item) {
          $scope.model.strF3 = null;
          if (item) {
            $scope.model.strF3 = item.strEnglish;
          }
        }

        $scope.sarChange = function (item) {
          $scope.model.strF6 = null;
          if (item) {
            $scope.model.strF6 = item.strName;
          }
        }

        $scope.judgeChange = function (item) {
          $scope.model.strF7 = null;
          if (item) {
            $scope.model.strF7 = item.strName;
          }
        }
      }
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

            model.decRM18 = v1 * 0.1 - v17;
            model.decRM2 = v1 * 0.1;
            model.decRM19 = v1 - model.decRM2;
            model.decRM22 = v1 + v3 + v20 + v21;
          }, 200);
        }
      }
    });

    formlyConfig.setType({
      name: 'loan',
      templateUrl: 'loan.html',
      controller: function ($scope, $timeout, refactorService) {
        $scope.loanTypes = ['Term Loan', 'Housing Loan', 'Overdraft', 'Trade finacing', 'Foreign Currency Loan',
                            'Guarantee', 'Others'];
        $scope.finacingTypes = ['Conventional', 'Islamic', 'Others'];

        $scope.calcForm = function (model) {
          $timeout(function () {
            var v4 = refactorService.convertFloat(angular.element('.rm4').val()),
                v5 = refactorService.convertFloat(angular.element('.rm5').val()),
                v6 = refactorService.convertFloat(angular.element('.rm6').val()),
                v23 = refactorService.convertFloat(angular.element('.rm23').val()),
                v24 = refactorService.convertFloat(angular.element('.rm24').val());

            model.decRM25 = v4 + v5 + v6 + v23 + v24;
          }, 200);
        };

        $scope.calcForm($scope.model);
      }
    });

    formlyConfig.setType({
      name: 'premises-rent',
      templateUrl: 'premises-rent.html',
      controller: function ($scope, $timeout, refactorService) {
        $scope.types = ['Dwelling House', 'Apartment', 'Condominium', 'Shop', 'Office', 
                        'Factory', 'Workshop', 'Land'];
        $scope.queryList = function (q) {
          return $scope.types.filter(function(item) {
            return item.search(new RegExp(q, "i")) > -1;
          });
        };

        $scope.calcForm = function (model) {
          $timeout(function () {
            var v2 = refactorService.convertFloat(angular.element('.rm2').val()),
                v3 = refactorService.convertFloat(angular.element('.rm3').val()),
                v4 = refactorService.convertFloat(angular.element('.rm4').val()),
                v5 = refactorService.convertFloat(angular.element('.rm5').val()),
                v11 = refactorService.convertFloat(angular.element('.rm11').val());
            model.decRM36 = v2 + v3 + v4 + v5 + v11;
          }, 200);
        }
      }
    });

    formlyConfig.setType({
      name: 'term',
      templateUrl: 'term.html',
      controller: function ($scope) {
        $scope.open = function($event, opened) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope[opened] = true;
        };
      }
    });

    formlyConfig.setType({
      name: 'summary',
      templateUrl: 'summary.html',
      controller: function ($scope, $uibModal, propertyService) {

        $scope.preview = function () {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'preview-summary.html',
            controller: function ($scope, $sce) {
              var content = document.getElementById('summary').innerHTML;
              content = content.replace('col-md-8 col-md-offset-1', 'col-md-10 col-md-offset-1')
              $scope.content = $sce.trustAsHtml(content);

              $scope.print = function () {
                var content = document.getElementById('summary').innerHTML;
                var printWindow = window.open('');

                printWindow.document.write("<html><head><style>  \
                  @font-face { \
                    font-family: roboto; \
                    src: url('fonts/roboto/Roboto-Regular-webfont.eot'); \
                    src: url('fonts/roboto/Roboto-Regular-webfont.eot?#iefix') format('embedded-opentype'), url('fonts/roboto/Roboto-Regular-webfont.woff') format('woff'), url('fonts/roboto/Roboto-Regular-webfont.ttf') format('truetype'), url('fonts/roboto/Roboto-Regular-webfont.svg#icon') format('svg'); \
                    font-weight: 400; \
                    font-style: normal; \
                  }             \
                  * { \
                    font-family: roboto; \
                  } \
                  .hidden-print {  \
                    display: none;  \
                  }  \
                  h2 {  \
                    color: #9c27b0 !important;  \
                  }  \
                  h4 {  \
                    color: #006400;  \
                    margin-bottom: 10px; \
                  }  \
                  h5 { \
                    font-size: 16px; \
                    margin-bottom: 0px; \
                  }             \
                  .col-md-5 {  \
                    width: 49%; \
                    float: left;  \
                  } \
                  .col-md-5.first {  \
                    padding-right: 5px; \
                  } \
                  .col-md-5.second {  \
                    padding-left: 5px; \
                  } \
                  dt { \
                    color: #eee; \
                    font-weight: 500; \
                  } \
                  dd { \
                    color: #eee; \
                  } \
                  .dl-horizontal dt { \
                    float: left; \
                    text-align: left; \
                    width: 130px; \
                  } \
                  .dl-horizontal dd { \
                    margin-left: 145px; \
                    word-wrap: break-word; \
                  } \
                  dt, dd { \
                    line-height: 1.32; \
                    font-size: 13px; \
                  } \
                  .dl-horizontal dd:after { \
                    display: table; \
                    content: ' '; \
                    clear: both; \
                  } \
                  dl { \
                    margin-top: 6px; \
                    margin-bottom: 6px; \
                  } \
                  @page { \
                    margin-top: 50px; \
                  } \
                  .logo-summary-report { \
                    width: 72px; \
                    position: absolute; \
                    top: 2px; \
                    right: 10px; \
                  }             \
                </style>");
                printWindow.document.write('</head><body class="summary">');
                printWindow.document.write(content);
                printWindow.document.write('</body></html>');
                printWindow.print();
                printWindow.close();
              }

            },
            size: 'lg',
            keyboard: true
          }).result.then(function () {}, function (res) {});
        }

        var propertyType = { "1": "Landed", "2": "Strata" };
        // property detail
        if ($scope.model.clsP1 && $scope.model.clsP1.code) {
          propertyService.getItem($scope.model.clsP1.code).then(function (item) {
            $scope.property = item;
            $scope.property.strPropertyType = propertyType[$scope.property.strPropertyType];
          });
        }

        // group labels from matter code
        $scope.matterCode = [];
        if ($scope.model.clsMatterCode && $scope.model.clsMatterCode.jsonFieldLabels) {
          $scope.matterCode = JSON.parse($scope.model.clsMatterCode.jsonFieldLabels);
        }

        $scope.getLabel = function (key) {
          for (var i = 0; i < $scope.matterCode.length; i++) {
            if ($scope.matterCode[i].JsonField == key) {
              return $scope.matterCode[i].Label;
            }
          }
        }
      }
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


    function bankDialog (model, key, viewMode) {
      if (viewMode && (!model[key] || !model[key].code)) {
        alert('Please select a bank branch.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entity-modal.html',
        controller: 'bankBranchEditCtrl',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          isNew: !viewMode,
          entityCode: function () {
            return viewMode ? model[key].code : null;
          },
          isDialog: true
        }
      });

      modalInstance.result.then(function (entity) {
        if (!viewMode && entity) {
          model[key] = {
            clsBankCode: entity.clsBankCode,
            clsCACCode: entity.clsCACCode,
            code: entity.code,
            strEmailAddress: entity.strEmailAddress,
            strName: entity.strName,
            strPhone1: entity.strPhone1,
            strPhone2: entity.strPhone2,
            strPhone3: entity.strPhone3,
            strPhoneFax: entity.strPhoneFax
          };
        }
      })
    }

    // bank group
    function bankCtrl ($scope, $uibModal) {
      $scope.queryBanks = function(searchText) {
        return getBankBranches(1, 10, searchText)
      };

      $scope.bankDialog = function(key, viewMode) {
        bankDialog($scope.model, key, viewMode);
      }

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
      controller: function($scope, NgTableParams, templateService, $uibModal) {
        $scope.sources = ['All', 'Online', 'User'];
        $scope.docInfo = {
          fileno: $scope.model.strFileNo1,
          source: 'All',
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
                var url = 'https://docs.google.com/gview?url=https://denningchat.com.my/'+
                          'denningwcf/'+data+'&embedded=true';
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
              return templateService.getTemplates($scope.docInfo, params.page(), params.count(), $scope.keyword)
              .then(function (data) {
                params.total(data.headers('x-total-count'));
                return data.data;
              });
            }
          })
        };

        $scope.search = function (event, clear) {
          if(event.which == 13 || clear) { 
            event.preventDefault();
            event.stopPropagation();

            if (clear) {
              $scope.keyword = '';
            }
            $scope.tableFilter.reload();
          }
        }

        templateService.getIndustries().then(function(data) {
          $scope.industries = data;
          $scope.docInfo.industry = data[0];
          $scope.updateCategory();
        });

        $scope.updateCategory = function() {
          templateService.getCategories($scope.docInfo).then(function(data) {
            $scope.categories = data;
            $scope.docInfo.category = data[0];
            $scope.updateType();
          });
        }

        $scope.updateType = function() {
          templateService.getTypes($scope.docInfo).then(function (data) {
            $scope.types = data;
            $scope.docInfo.type = data[0];
            $scope.updateSubType();
          });
        }

        $scope.updateSubType = function() {
          templateService.getSubTypes($scope.docInfo).then(function(data) {
            $scope.subTypes = data;
            $scope.docInfo.subType = data[0];
            $scope.updateTemplates();
          });
        }
      }
    });
  })
