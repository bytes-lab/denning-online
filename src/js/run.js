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
                presetbillService, spaChecklistService, bankBranchService, staffService) 
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
      return staffService.getList(1, 10, keyword).then(function (resp) {
        return resp.data;
      });
    }

    function getPresetBills(page, pagesize, keyword) {
      return presetbillService.getTableList(page, pagesize, keyword).then(function (resp) {
        return resp;
      });
    }

    function getPresetChecklist(page, pagesize, keyword) {
      return spaChecklistService.getList(page, pagesize, keyword).then(function (resp) {
        return resp.data;
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

    function queryShares(q) {
      var shareList = ['1/1', '1/2', '1/3', '1/4', '1/5', '1/10'];

      var arr = shareList.filter(function (item) {
        return item.search(new RegExp(q, "i")) > -1;
      });

      if (arr && arr.length == 0) {
        return [q];
      } else {
        return arr;
      }
    }

    // contact attribute
    formlyConfig.setType({
      name: 'contact',
      templateUrl: 'contact.html',
      controller: function ($scope, Auth) {
        $scope.userInfo = Auth.getUserInfo();

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
            if (!$scope.model['clsC'+(i+1)] && !$scope.model.tmp['clsC'+(i+1)]) {
              last = i;
              break;
            }
            $scope.model['clsC'+i] = $scope.model['clsC'+(i+1)];
            $scope.model['strShareC'+i] = $scope.model['strShareC'+(i+1)];            
            $scope.model.tmp['clsC'+i] = $scope.model.tmp['clsC'+(i+1)];
          }
          $scope.model.tmp['clsC'+last] = false;
          $scope.model['clsC'+last] = {};
          $scope.model['strShareC'+last] = "";
        }

        $scope.queryShares = function (q) {
          return queryShares(q);
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
        $scope.propertyTypes = { "1": "Landed", "2": "Strata" };
        for (var i = 1; i <= 5; i++) {
          if ($scope.model['clsP'+i] && $scope.model['clsP'+i].code) {
            $scope.model.tmp['clsP'+i] = true;
          }
        }

        function initProperty(item) {
          if (item && item.code) {
            propertyService.getItem(item.code).then(function (item) {
              $scope.property = item;
            });
          } else {
            // $scope.property = {};
          }          
        }

        $scope.queryShares = function (q) {
          return queryShares(q);
        };

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
            if (!$scope.model['clsP'+(i+1)] && !$scope.model.tmp['clsP'+(i+1)]) {
              last = i;
              break;
            }
            $scope.model['clsP'+i] = $scope.model['clsP'+(i+1)];
            $scope.model['strShare'+i] = $scope.model['strShare'+(i+1)];
            $scope.model.tmp['clsP'+i] = $scope.model.tmp['clsP'+(i+1)];
          }
          $scope.model.tmp['clsP'+last] = false;
          $scope.model['clsP'+last] = {};
          $scope.model['strShare'+last] = "";          
        }

        $scope.queryProperties = function(searchText) {
          return getProperties(1, 10, searchText);
        }

        $scope.propertyDialog = function(key, viewMode) {
          if (viewMode && !$scope.model[key].code) {
            alert('Please select a property.');
            return false;
          }

          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'entity-modal.html',
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

        $scope.matterCodeDialog = function(key, viewMode) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'entity-modal.html',
            controller: 'matterCodeEditCtrl',
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

          modalInstance.result.then(function (entity) {
            if (entity) {
              $scope.model[key] = entity;
            }
          })
        }
      }
    });

    function judgeDialog (model, key, viewMode) {
      if (viewMode && (!model[key] || !model[key].code)) {
        alert('Please select a judge.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entity-modal.html',
        controller: 'judgeEditCtrl',
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
            strName: entity.strName,
            strPositionTitle: entity.strPositionTitle,
            strTitle1: entity.strTitle1,
            strtitle2: entity.strtitle2
          };
        }
      })
    }

    function sarDialog (model, key, viewMode) {
      if (viewMode && (!model[key] || !model[key].code)) {
        alert('Please select a SAR.');
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entity-modal.html',
        controller: 'sarEditCtrl',
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
            strName: entity.strName,
            strPositionTitle: entity.strPositionTitle,
            strTitle1: entity.strTitle1,
            strtitle2: entity.strtitle2
          };
        }
      })
    }

    // case attribute
    formlyConfig.setType({
      name: 'case',
      templateUrl: 'case.html',
      controller: function ($scope, caseService, judgeService, courtService, sarService) {
        if ($scope.model.strF2) {
          $scope.court = { strTypeE: $scope.model.strF2 };
        }

        if ($scope.model.strF3) {
          $scope.caseType = { strEnglish: $scope.model.strF3 };
        }

        if ($scope.model.strF8) {
          $scope.courtPlace = { strPlace: $scope.model.strF8 };
        }

        $scope.judgeDialog = function(key, viewMode) {
          judgeDialog($scope.model, key, viewMode);
        }

        $scope.sarDialog = function(key, viewMode) {
          sarDialog($scope.model, key, viewMode);
        }

        $scope.queryCaseTypes = function (searchText) {
          return caseService.getList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.queryCourts = function (searchText) {
          return courtService.getTypeList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.queryCourtPlaces = function (searchText) {
          return courtService.getList(1, 10, searchText, $scope.model.strF2).then(function (resp) {
            return resp.data;
          })
        }

        $scope.queryJudges = function (searchText) {
          return judgeService.getList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.querySAR = function (searchText) {
          return sarService.getList(1, 10, searchText).then(function (resp) {
            return resp.data;
          })
        }

        $scope.courtChange = function (item) {
          if (item) {
            $scope.model.strF2 = item.strTypeE;
          } else {
            $scope.model.strF2 = null;
            $scope.courtPlace = null;
          }
        }

        $scope.courtPlaceChange = function (item) {
          if (item) {
            $scope.model.strF1 = item.code;
            $scope.model.strF8 = item.strPlace + ' ' + item.strState;
          } else {
            $scope.model.strF1 = '';
            $scope.model.strF8 = '';
          }
        }

        $scope.caseTypeChange = function (item) {
          $scope.model.strF3 = null;
          if (item) {
            $scope.model.strF3 = item.strEnglish;
          }
        }
      }
    });

    // price attribute
    formlyConfig.setType({
      name: 'price',
      templateUrl: 'price.html',
      controller: function ($scope, $timeout, refactorService, Auth, matterService) {
        $scope.userInfo = Auth.getUserInfo();
        if ($scope.model.strPurchasePriceSymbol) {
          $scope.clsPurchasePriceSymbol = {
            symbol: $scope.model.strPurchasePriceSymbol,
            code: '-'
          };          
        } else {
          $scope.clsPurchasePriceSymbol = {
            symbol: Auth.getUserInfo().currency,
            code: '-'
          };
        }

        $scope.taxType = "1";

        if ($scope.model.decPriceGst) {
          $scope.model.tmp.decPriceGst = parseInt($scope.model.decPriceGst) + ' %';
        }

        $scope.calcTax = function () {
          var R = refactorService.convertFloat($scope.model.decPriceGst)
              A = refactorService.convertFloat($scope.model.decRM1);

          if ($scope.taxType == "1") {
            $scope.n1d = A.toFixed(2);
            $scope.model.decRM36 = 0;
            $scope.n3d = A.toFixed(2);
          } else if ($scope.taxType == "2") {
            $scope.n1d = (A * 100 / (100 + R)).toFixed(2);
            $scope.model.decRM36 = (A * R / (100 + R)).toFixed(2);
            $scope.n3d = A.toFixed(2);
          } else {
            $scope.n1d = A.toFixed(2);
            $scope.model.decRM36 = (A * R / 100).toFixed(2);
            $scope.n3d = (A + A * R / 100).toFixed(2);
          }
        }

        $scope.calcTax();

        $scope.queryTaxes = function () {
          var data = [];
          for (var i = 0; i < 11; i++) {
            data.push(i+' %');
          }

          return data;
        }

        $scope.taxChange = function (item) {
          if (item) {
            $scope.model.decPriceGst = item.replace(' %', '.00');
            $scope.calcTax();
          }
        }

        $scope.queryCurrency = function (keyword) {
          return matterService.getCurrencyList(1, 10, keyword).then(function (resp) {
            return resp.data;
          });
        }

        $scope.currencyChange = function (item) {
          if (item && item.code) {
            $scope.model.strPurchasePriceSymbol = item.symbol;
          }
        }

        $scope.calcDeposit = function (fixed_deposit) {
          if (fixed_deposit) {
            $scope.model.decRM18 = (refactorService.convertFloat($scope.model.decRM1) * 0.1 - refactorService.convertFloat($scope.model.decRM17)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          } else {
            $scope.model.decRM18 = '';
          }

          $scope.calcForm($scope.model);
        };

        $scope.calcForm = function (model) {
          $timeout(function () {
            var v1 = refactorService.convertFloat(angular.element('.rm1').val()),
                v3 = refactorService.convertFloat(angular.element('.rm3').val()),
                v17 = refactorService.convertFloat(angular.element('.rm17').val()),
                v18 = refactorService.convertFloat(angular.element('.rm18').val()),
                v20 = refactorService.convertFloat(angular.element('.rm20').val()),
                v21 = refactorService.convertFloat(angular.element('.rm21').val());

            model.decRM2 = v17 + v18;
            model.decRM19 = v1 - model.decRM2;
            model.decRM22 = v1 + v3 + v20 + v21;
          }, 200);
        };

        $scope.calcForm($scope.model);
      }
    });

    formlyConfig.setType({
      name: 'loan',
      templateUrl: 'loan.html',
      controller: function ($scope, $timeout, refactorService, matterService, Auth) {
        $scope.loanTypes = ['Term Loan', 'Housing Loan', 'Overdraft', 'Trade finacing', 'Foreign Currency Loan',
                            'Guarantee', 'Others'];
        $scope.finacingTypes = ['Conventional', 'Islamic', 'Others'];

        if ($scope.model.strLoanPriceSymbol) {
          $scope.clsLoanPriceSymbol = {
            symbol: $scope.model.strLoanPriceSymbol,
            code: '-'
          };          
        } else {
          $scope.clsLoanPriceSymbol = {
            symbol: Auth.getUserInfo().currency,
            code: '-'
          };
        }

        $scope.queryCurrency = function (keyword) {
          return matterService.getCurrencyList(1, 10, keyword).then(function (resp) {
            return resp.data;
          });
        }

        $scope.currencyChange = function (item) {
          if (item && item.code) {
            $scope.model.strLoanPriceSymbol = item.symbol;
          }
        }

        $scope.calcForm = function (model) {
          $timeout(function () {
            var v4 = refactorService.convertFloat(angular.element('.rm4').val()),
                v5 = refactorService.convertFloat(angular.element('.rm5').val()),
                v6 = refactorService.convertFloat(angular.element('.rm6').val()),
                v23 = refactorService.convertFloat(angular.element('.rm23').val()),
                v24 = refactorService.convertFloat(angular.element('.rm24').val());

            model.decRM25 = v4 + v5 + v6 + v23 + v24;
            model.tmp.tlod = v4 + v5;
            model.tmp.diffSum = refactorService.convertFloat(model.decRM19) - v4 - v5;
          }, 200);
        };

        $scope.calcForm($scope.model);
      }
    });

    formlyConfig.setType({
      name: 'trade_loan',
      templateUrl: 'trade_loan.html',
      controller: function ($scope, $timeout, refactorService, matterService, Auth) {
        $scope.loanTypes = ['Term Loan', 'Housing Loan', 'Overdraft', 'Trade finacing', 'Foreign Currency Loan',
                            'Guarantee', 'Others'];
        $scope.finacingTypes = ['Conventional', 'Islamic', 'Others'];

        if ($scope.model.strLoanPriceSymbol) {
          $scope.clsLoanPriceSymbol = {
            symbol: $scope.model.strLoanPriceSymbol,
            code: '-'
          };          
        } else {
          $scope.clsLoanPriceSymbol = {
            symbol: Auth.getUserInfo().currency,
            code: '-'
          };
        }

        $scope.queryCurrency = function (keyword) {
          return matterService.getCurrencyList(1, 10, keyword).then(function (resp) {
            return resp.data;
          });
        }

        $scope.currencyChange = function (item) {
          if (item && item.code) {
            $scope.model.strLoanPriceSymbol = item.symbol;
          }
        }

        $scope.calcForm = function (model) {
          $timeout(function () {
            var v4 = refactorService.convertFloat(angular.element('.rm4').val()),
                v5 = refactorService.convertFloat(angular.element('.rm5').val()),
                v6 = refactorService.convertFloat(angular.element('.rm6').val()),
                v16 = refactorService.convertFloat(angular.element('.rm16').val()),
                v17 = refactorService.convertFloat(angular.element('.rm17').val()),
                v13 = refactorService.convertFloat(angular.element('.rm13').val()),
                v11 = refactorService.convertFloat(angular.element('.rm11').val());

            model.decRM25 = v4 + v5 + v6 + v16 + v17 + v13 + v11;
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
        $scope.parties = ['', 'Tenant', 'Landlord', 'Tenant & Landlord Equally'];
        $scope.terms = ['', '1 year', '2 years', '3 years', '4 years', '5 years'];
        $scope.periods = ['', 'Not Allowed', '1 month', '2 months', '3 months'];
        
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
                  } \
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
      name: 'currency',
      templateUrl: 'currency.html',
      controller: function($scope, $filter, refactorService) {
        for (i = 1; i <= 36; i++) {
          $scope.model['decRM'+i] = $filter('number')(refactorService.convertFloat($scope.model['decRM'+i]), 2);
        }
      }
    });

    formlyConfig.setType({
      name: 'text',
      templateUrl: 'text.html',
    });

    formlyConfig.setType({
      name: 'date',
      templateUrl: 'date.html',
      controller: function($scope) {
        $scope.opened = {};

        $scope.open = function($event, field) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened[field] = true;
        };
      }
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
      $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
      };

      $scope.queryBanks = function(searchText) {
        return getBankBranches(1, 10, searchText)
      };

      $scope.bankDialog = function(key, viewMode) {
        bankDialog($scope.model, key, viewMode);
      }

      $scope.bankCACDialog = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'entity-modal.html',
          controller: 'bankCACEditCtrl',
          controllerAs: 'vm',
          size: 'lg',
          backdrop: 'static',
          keyboard: true,
          resolve: {
            isNew: false,
            entityCode: function () {
              return $scope.model.clsBank2.clsCACCode.code;
            },
            isDialog: true
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
          $scope.keyword = '';
          templateService.getSubTypes($scope.docInfo).then(function(data) {
            $scope.subTypes = data;
            $scope.docInfo.subType = data[0];
            $scope.updateTemplates();
          });
        }
      }
    });
  })
