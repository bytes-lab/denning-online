denningOnline
  .config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/home");

    $stateProvider
      //------------------------------
      // LOGIN
      //------------------------------

      .state ('login', {
        data: {
          access: '?'
        },
        url: '/login',
        controller: 'loginCtrl as lctrl',
        templateUrl: 'views/login.html'        
      })    

      //------------------------------
      // HOME
      //------------------------------

      .state ('home', {
        data: {
          access: '@'
        },
        url: '/home',
        templateUrl: 'views/home.html'
      })

      .state ('open-file', {
        data: {
          access: '@'
        },
        url: '/open-file/:url',
        controller: 'openFileCtrl as vm',
        templateUrl: 'views/tmp-open-file.html'
      })
      //------------------------------
      // SEARCH
      //------------------------------

      .state ('search', {
        data: {
          access: '@'
        },
        url: '/search',
        templateUrl: 'views/search.html'        
      })    

      //------------------------------
      // OVERVIEW
      //------------------------------

      .state ('overview', {
        data: {
          access: '@'
        },
        url: '/overview',
        controller: 'overviewCtrl as vm',
        templateUrl: 'views/overview.html',
        resolve: {
          loadPlugin: function($ocLazyLoad) {
            return $ocLazyLoad.load ([
              {
                name: 'vendors',
                insertBefore: '#app-level-js',
                files: [
                  'vendors/sparklines/jquery.sparkline.min.js',
                  'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'
                ]
              }
            ])
          }
        }
      })


      //------------------------------
      // FILE MATTER
      //------------------------------
    
      .state ('file-matters', {
        data: {
          access: '@'
        },        
        url: '/file-matters',
        templateUrl: 'views/common.html'
      })
            
      .state ('file-matters.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'fileMatterListCtrl as vm',
        templateUrl: 'views/file-matter-list.html'
      })

      .state ('file-matters.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:fileNo/:tab',
        controller: 'fileMatterEditCtrl as vm',
        templateUrl: 'views/file-matter-edit.html',
        resolve: {
          loadPlugin: function($ocLazyLoad) {
            return $ocLazyLoad.load ([
              {
                name: 'vendors',
                files: [
                  'vendors/input-mask/input-mask.min.js',
                ]
              }
            ])
          }
        }
      })

      .state ('file-matters.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'fileMatterEditCtrl as vm',
        templateUrl: 'views/file-matter-edit.html'
      })

      //------------------------------
      // MATTER FORM
      //------------------------------
      .state ('matter-forms', {
        data: {
          access: '@'
        },        
        url: '/matter-forms',
        templateUrl: 'views/common.html'
      })

      .state ('matter-forms.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'matterformListCtrl as vm',
        templateUrl: 'views/matter-form-list.html'
      })

      .state ('matter-forms.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:code',
        controller: 'matterformEditCtrl as vm',
        templateUrl: 'views/matter-form-edit.html'
      })

      .state ('matter-forms.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'matterformEditCtrl as vm',
        templateUrl: 'views/matter-form-edit.html'
      })

      //------------------------------
      // MATTER CODE
      //------------------------------
    
      .state ('matter-codes', {
        data: {
          access: '@'
        },        
        url: '/matter-codes',
        templateUrl: 'views/common.html'
      })
            
      .state ('matter-codes.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'matterCodeListCtrl as vm',
        templateUrl: 'views/matter-code-list.html'
      })

      .state ('matter-codes.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'matterCodeEditCtrl as vm',
        templateUrl: 'views/matter-code-edit.html'
      })
      .state ('matter-codes.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'matterCodeEditCtrl as vm',
        templateUrl: 'views/matter-code-edit.html'
      })

      //------------------------------
      // FOLDERS
      //------------------------------
    
      .state ('folders', {
        data: {
          access: '@'
        },
        url: '/folders',
        templateUrl: 'views/common.html'
      })
      .state ('folders.list', {
        data: {
          access: '@'
        },
        url: '/:id/:type',
        controller: 'folderListCtrl as vm',
        templateUrl: 'views/folder-list.html'
      })

      //------------------------------
      // CONTACTS
      //------------------------------
    
      .state ('contacts', {
        data: {
          access: '@'
        },
        url: '/contacts',
        templateUrl: 'views/common.html'
      })
      .state ('contacts.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'contactListCtrl as vm',
        templateUrl: 'views/contact-list.html'
      })
      .state ('contacts.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'contactEditCtrl as vm',
        templateUrl: 'views/contact-edit.html'
      })
      .state ('contacts.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/new/',
        controller: 'contactEditCtrl as vm',
        templateUrl: 'views/contact-edit.html'
      })
      .state ('contacts.matters', {
        data: {
          access: '@',
          type: 'customer'
        },
        url: '/:id/matters',
        controller: 'relatedMatterCtrl as vm',
        templateUrl: 'views/file-matter-list.html',
      })

      //------------------------------
      // BILLING ITEMS
      //------------------------------
    
      .state ('billingitems', {
        data: {
          access: '@'
        },        
        url: '/billingitems',
        templateUrl: 'views/common.html'
      })
            
      .state ('billingitems.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'billingitemListCtrl as vm',
        templateUrl: 'views/billingitem-list.html'
      })

      .state ('billingitems.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'billingitemEditCtrl as vm',
        templateUrl: 'views/billingitem-edit.html'
      })
      .state ('billingitems.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'billingitemEditCtrl as vm',
        templateUrl: 'views/billingitem-edit.html'
      })

      //------------------------------
      // PAYMENT RECORDS
      //------------------------------
    
      .state ('payment-records', {
        data: {
          access: '@'
        },        
        url: '/payment-records',
        templateUrl: 'views/common.html'
      })
            
      .state ('payment-records.list', {
        data: {
          access: '@'
        },        
        url: '/:fileNo',
        controller: 'paymentRecordListCtrl as vm',
        templateUrl: 'views/payment-record-list.html'
      })

      //------------------------------
      // ACCOUNTS
      //------------------------------
    
      .state ('accounts', {
        data: {
          access: '@'
        },        
        url: '/accounts',
        templateUrl: 'views/common.html'
      })
            
      .state ('accounts.list', {
        data: {
          access: '@'
        },        
        url: '/:fileNo/:fileName',
        controller: 'accountListCtrl as vm',
        templateUrl: 'views/account-list-1.html'
      })

      .state ('accounts.list2', {
        data: {
          access: '@'
        },        
        url: '/:fileNo/:fileName/:category',
        controller: 'accountList2Ctrl as vm',
        templateUrl: 'views/account-list-2.html'
      })

      //------------------------------
      // NOTES
      //------------------------------
    
      .state ('notes', {
        data: {
          access: '@'
        },        
        url: '/notes',
        templateUrl: 'views/common.html'
      })
            
      .state ('notes.list', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName',
        controller: 'noteListCtrl as vm',
        templateUrl: 'views/note-list.html'
      })

      .state ('notes.edit', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName/edit/:id',
        controller: 'noteEditCtrl as vm',
        templateUrl: 'views/note-edit.html'
      })
      .state ('notes.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/:fileNo/:fileName/new',
        controller: 'noteEditCtrl as vm',
        templateUrl: 'views/note-edit.html',
        resolve: {
          loadPlugin: function($ocLazyLoad) {
            return $ocLazyLoad.load ([
              {
                name: 'css',
                insertBefore: '#app-level',
                files: [
                  'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                ]
              },
              {
                name: 'vendors',
                files: [
                  'vendors/input-mask/input-mask.min.js',
                  'vendors/bower_components/nouislider/jquery.nouislider.min.js',
                  'vendors/bower_components/moment/min/moment.min.js',
                  'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                ]
              }
            ])
          }
        }        
      })


      //------------------------------
      // QUOTATIONS
      //------------------------------
    
      .state ('quotations', {
        data: {
          access: '@'
        },        
        url: '/quotations',
        templateUrl: 'views/common.html'
      })
            
      .state ('quotations.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'quotationListCtrl as vm',
        templateUrl: 'views/quotation-list.html'
      })

      .state ('quotations.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'quotationEditCtrl as vm',
        templateUrl: 'views/quotation-edit.html'
      })
      .state ('quotations.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'quotationEditCtrl as vm',
        templateUrl: 'views/quotation-edit.html'
      })



      //------------------------------
      // INVOICES
      //------------------------------
    
      .state ('invoices', {
        data: {
          access: '@'
        },        
        url: '/invoices',
        templateUrl: 'views/common.html'
      })
            
      .state ('invoices.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'invoiceListCtrl as vm',
        templateUrl: 'views/invoice-list.html'
      })

      .state ('invoices.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'invoiceEditCtrl as vm',
        templateUrl: 'views/invoice-edit.html'
      })
      .state ('invoices.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'invoiceEditCtrl as vm',
        templateUrl: 'views/invoice-edit.html'
      })



      //------------------------------
      // RECEIPTS
      //------------------------------
    
      .state ('receipts', {
        data: {
          access: '@'
        },        
        url: '/receipts',
        templateUrl: 'views/common.html'
      })
            
      .state ('receipts.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'receiptListCtrl as vm',
        templateUrl: 'views/receipt-list.html'
      })

      .state ('receipts.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'receiptEditCtrl as vm',
        templateUrl: 'views/receipt-edit.html'
      })
      .state ('receipts.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'receiptEditCtrl as vm',
        templateUrl: 'views/receipt-edit.html'
      })



      //------------------------------
      // PRESET BILLS
      //------------------------------
    
      .state ('presetbills', {
        data: {
          access: '@'
        },        
        url: '/presetbills',
        templateUrl: 'views/common.html'
      })
            
      .state ('presetbills.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'presetbillListCtrl as vm',
        templateUrl: 'views/presetbill-list.html'
      })

      .state ('presetbills.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'presetbillEditCtrl as vm',
        templateUrl: 'views/presetbill-edit.html'
      })
      .state ('presetbills.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'presetbillEditCtrl as vm',
        templateUrl: 'views/presetbill-edit.html'
      })



      //------------------------------
      // PROPERTIES
      //------------------------------
    
      .state ('properties', {
        data: {
          access: '@'
        },        
        url: '/properties',
        templateUrl: 'views/common.html'
      })
            
      .state ('properties.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'propertyListCtrl as vm',
        templateUrl: 'views/property-list.html'
      })

      .state ('properties.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'propertyEditCtrl as vm',
        templateUrl: 'views/property-edit.html'
      })
      .state ('properties.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'propertyEditCtrl as vm',
        templateUrl: 'views/property-edit.html'
      })
      .state ('properties.matters', {
        data: {
          access: '@',
          type: 'property'
        },
        url: '/:id/matters',
        controller: 'relatedMatterCtrl as vm',
        templateUrl: 'views/file-matter-list.html',
      })
      
      //------------------------------
      // OCCUPATIONS
      //------------------------------
    
      .state ('occupations', {
        data: {
          access: '@'
        },        
        url: '/occupations',
        templateUrl: 'views/common.html'
      })
            
      .state ('occupations.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'occupationListCtrl as vm',
        templateUrl: 'views/occupation-list.html'
      })

      .state ('occupations.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'occupationEditCtrl as vm',
        templateUrl: 'views/occupation-edit.html'
      })
      .state ('occupations.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'occupationEditCtrl as vm',
        templateUrl: 'views/occupation-edit.html'
      })     


      //------------------------------
      // IRD-branches
      //------------------------------
    
      .state ('IRD-branches', {
        data: {
          access: '@'
        },        
        url: '/IRD-branches',
        templateUrl: 'views/common.html'
      })
            
      .state ('IRD-branches.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'IRDBranchListCtrl as vm',
        templateUrl: 'views/IRD-branch-list.html'
      })

      .state ('IRD-branches.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'IRDBranchEditCtrl as vm',
        templateUrl: 'views/IRD-branch-edit.html'
      })
      .state ('IRD-branches.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'IRDBranchEditCtrl as vm',
        templateUrl: 'views/IRD-branch-edit.html'
      })  


      //------------------------------
      // CITIES
      //------------------------------
    
      .state ('cities', {
        data: {
          access: '@'
        },        
        url: '/cities',
        templateUrl: 'views/common.html'
      })
            
      .state ('cities.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'cityListCtrl as vm',
        templateUrl: 'views/city-list.html'
      })

      .state ('cities.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'cityEditCtrl as vm',
        templateUrl: 'views/city-edit.html'
      })
      .state ('cities.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'cityEditCtrl as vm',
        templateUrl: 'views/city-edit.html'
      })  


      //------------------------------
      // STAFFS
      //------------------------------
    
      .state ('staffs', {
        data: {
          access: '@'
        },        
        url: '/staffs',
        templateUrl: 'views/common.html'
      })
            
      .state ('staffs.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'staffListCtrl as vm',
        templateUrl: 'views/staff-list.html'
      })

      .state ('staffs.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'staffEditCtrl as vm',
        templateUrl: 'views/staff-edit.html'
      })
      .state ('staffs.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'staffEditCtrl as vm',
        templateUrl: 'views/staff-edit.html'
      })  


      //------------------------------
      // BANKS
      //------------------------------
    
      .state ('banks', {
        data: {
          access: '@'
        },        
        url: '/banks',
        templateUrl: 'views/common.html'
      })
            
      .state ('banks.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'bankListCtrl as vm',
        templateUrl: 'views/bank-list.html'
      })

      .state ('banks.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'bankEditCtrl as vm',
        templateUrl: 'views/bank-edit.html'
      })
      .state ('banks.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'bankEditCtrl as vm',
        templateUrl: 'views/bank-edit.html'
      })  


      //------------------------------
      // BANK BRANCHES
      //------------------------------
    
      .state ('bank-branches', {
        data: {
          access: '@'
        },        
        url: '/bank-branches',
        templateUrl: 'views/common.html'
      })
            
      .state ('bank-branches.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'bankBranchListCtrl as vm',
        templateUrl: 'views/bank-branch-list.html'
      })

      .state ('bank-branches.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'bankBranchEditCtrl as vm',
        templateUrl: 'views/bank-branch-edit.html'
      })
      .state ('bank-branches.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'bankBranchEditCtrl as vm',
        templateUrl: 'views/bank-branch-edit.html'
      })  


      //------------------------------
      // bank-CACs
      //------------------------------
    
      .state ('bank-CACs', {
        data: {
          access: '@'
        },        
        url: '/bank-CACs',
        templateUrl: 'views/common.html'
      })
            
      .state ('bank-CACs.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'bankCACListCtrl as vm',
        templateUrl: 'views/bank-CAC-list.html'
      })

      .state ('bank-CACs.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'bankCACEditCtrl as vm',
        templateUrl: 'views/bank-CAC-edit.html'
      })
      .state ('bank-CACs.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'bankCACEditCtrl as vm',
        templateUrl: 'views/bank-CAC-edit.html'
      })  

              
      //------------------------------
      // BANK-ATTORNEYS
      //------------------------------
    
      .state ('bank-attorneys', {
        data: {
          access: '@'
        },        
        url: '/bank-attorneys',
        templateUrl: 'views/common.html'
      })
            
      .state ('bank-attorneys.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'bankAttorneyListCtrl as vm',
        templateUrl: 'views/bank-attorney-list.html'
      })

      .state ('bank-attorneys.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'bankAttorneyEditCtrl as vm',
        templateUrl: 'views/bank-attorney-edit.html'
      })
      .state ('bank-attorneys.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'bankAttorneyEditCtrl as vm',
        templateUrl: 'views/bank-attorney-edit.html'
      })  


      //------------------------------
      // LEGAL-FIRMS
      //------------------------------
    
      .state ('legal-firms', {
        data: {
          access: '@'
        },        
        url: '/legal-firms',
        templateUrl: 'views/common.html'
      })
            
      .state ('legal-firms.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'legalFirmListCtrl as vm',
        templateUrl: 'views/legal-firm-list.html'
      })

      .state ('legal-firms.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'legalFirmEditCtrl as vm',
        templateUrl: 'views/legal-firm-edit.html'
      })
      .state ('legal-firms.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'legalFirmEditCtrl as vm',
        templateUrl: 'views/legal-firm-edit.html'
      })        


      //------------------------------
      // JUDGES
      //------------------------------
    
      .state ('judges', {
        data: {
          access: '@'
        },        
        url: '/judges',
        templateUrl: 'views/common.html'
      })
            
      .state ('judges.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'judgeListCtrl as vm',
        templateUrl: 'views/judge-list.html'
      })

      .state ('judges.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'judgeEditCtrl as vm',
        templateUrl: 'views/judge-edit.html'
      })
      .state ('judges.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'judgeEditCtrl as vm',
        templateUrl: 'views/judge-edit.html'
      })  


      //------------------------------
      // COURTS
      //------------------------------
    
      .state ('courts', {
        data: {
          access: '@'
        },        
        url: '/courts',
        templateUrl: 'views/common.html'
      })
            
      .state ('courts.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'courtListCtrl as vm',
        templateUrl: 'views/court-list.html'
      })

      .state ('courts.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'courtEditCtrl as vm',
        templateUrl: 'views/court-edit.html'
      })
      .state ('courts.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'courtEditCtrl as vm',
        templateUrl: 'views/court-edit.html'
      })  

      //------------------------------
      // LAND-OFFICES
      //------------------------------
    
      .state ('land-offices', {
        data: {
          access: '@'
        },        
        url: '/land-offices',
        templateUrl: 'views/common.html'
      })
            
      .state ('land-offices.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'landOfficeListCtrl as vm',
        templateUrl: 'views/land-office-list.html'
      })

      .state ('land-offices.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'landOfficeEditCtrl as vm',
        templateUrl: 'views/land-office-edit.html'
      })
      .state ('land-offices.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'landOfficeEditCtrl as vm',
        templateUrl: 'views/land-office-edit.html'
      })  


      //------------------------------
      // LAND-PTGS
      //------------------------------
    
      .state ('land-PTGs', {
        data: {
          access: '@'
        },        
        url: '/land-PTGs',
        templateUrl: 'views/common.html'
      })
            
      .state ('land-PTGs.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'landPTGListCtrl as vm',
        templateUrl: 'views/land-PTG-list.html'
      })

      .state ('land-PTGs.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'landPTGEditCtrl as vm',
        templateUrl: 'views/land-PTG-edit.html'
      })
      .state ('land-PTGs.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'landPTGEditCtrl as vm',
        templateUrl: 'views/land-PTG-edit.html'
      })  

                                                                     //------------------------------
      // BUILDINGS
      //------------------------------
    
      .state ('buildings', {
        data: {
          access: '@'
        },        
        url: '/buildings',
        templateUrl: 'views/common.html'
      })
            
      .state ('buildings.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'buildingListCtrl as vm',
        templateUrl: 'views/building-list.html'
      })

      .state ('buildings.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'buildingEditCtrl as vm',
        templateUrl: 'views/building-edit.html'
      })
      .state ('buildings.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'buildingEditCtrl as vm',
        templateUrl: 'views/building-edit.html'
      })  


      //------------------------------
      // PROJECTS
      //------------------------------
    
      .state ('projects', {
        data: {
          access: '@'
        },        
        url: '/projects',
        templateUrl: 'views/common.html'
      })
            
      .state ('projects.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'projectListCtrl as vm',
        templateUrl: 'views/project-list.html'
      })

      .state ('projects.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'projectEditCtrl as vm',
        templateUrl: 'views/project-edit.html'
      })
      .state ('projects.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'projectEditCtrl as vm',
        templateUrl: 'views/project-edit.html'
      })  


      //------------------------------
      // MUKIMS
      //------------------------------
    
      .state ('mukims', {
        data: {
          access: '@'
        },        
        url: '/mukims',
        templateUrl: 'views/common.html'
      })
            
      .state ('mukims.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'mukimListCtrl as vm',
        templateUrl: 'views/mukim-list.html'
      })

      .state ('mukims.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'mukimEditCtrl as vm',
        templateUrl: 'views/mukim-edit.html'
      })
      .state ('mukims.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'mukimEditCtrl as vm',
        templateUrl: 'views/mukim-edit.html'
      })  


      //------------------------------
      // LOAN-TYPES
      //------------------------------
    
      .state ('loan-types', {
        data: {
          access: '@'
        },        
        url: '/loan-types',
        templateUrl: 'views/common.html'
      })
            
      .state ('loan-types.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'loanTypeListCtrl as vm',
        templateUrl: 'views/loan-type-list.html'
      })

      .state ('loan-types.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'loanTypeEditCtrl as vm',
        templateUrl: 'views/loan-type-edit.html'
      })
      .state ('loan-types.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'loanTypeEditCtrl as vm',
        templateUrl: 'views/loan-type-edit.html'
      })  


      //------------------------------
      // CKHTs
      //------------------------------
    
      .state ('CKHTs', {
        data: {
          access: '@'
        },        
        url: '/CKHTs',
        templateUrl: 'views/common.html'
      })
            
      .state ('CKHTs.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'CKHTListCtrl as vm',
        templateUrl: 'views/CKHT-list.html'
      })

      .state ('CKHTs.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'CKHTEditCtrl as vm',
        templateUrl: 'views/CKHT-edit.html'
      })
      .state ('CKHTs.new', {
        data: {
          access: '@'
        },        
        url: '/new',
        controller: 'CKHTEditCtrl as vm',
        templateUrl: 'views/CKHT-edit.html'
      })                          

      //------------------------------
      // COURT DIARY
      //------------------------------

      .state ('courtdiary', {
        data: {
          access: '@'
        },
        url: '/courtdiary/:keyword',
        templateUrl: 'views/courtdiary-list.html',
        resolve: {
          loadPlugin: function($ocLazyLoad) {
            return $ocLazyLoad.load ([
              {
                name: 'css',
                insertBefore: '#app-level',
                files: [
                  'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                ]
              },
              {
                name: 'vendors',
                files: [
                  'vendors/bower_components/moment/min/moment.min.js',
                  'vendors/bower_components/fullcalendar/dist/fullcalendar.min.js'
                ]
              }
            ])
          }
        }
      })    
    
      .state ('courtdiaries', {
        data: {
          access: '@'
        },        
        url: '/courtdiaries',
        templateUrl: 'views/common.html'
      })            
      .state ('courtdiaries.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'courtdiaryEditCtrl as vm',
        templateUrl: 'views/courtdiary-edit.html'
      })
      .state ('courtdiaries.new', {
        data: {
          access: '@',
          can_edit: true
        },        
        url: '/new',
        controller: 'courtdiaryEditCtrl as vm',
        templateUrl: 'views/courtdiary-edit.html'
      })  


      //------------------------------
      // SPA CHECKLIST ITEMS
      //------------------------------
    
      .state ('spaclitems', {
        data: {
          access: '@'
        },        
        url: '/spaclitems',
        templateUrl: 'views/common.html'
      })
            
      .state ('spaclitems.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'spaclitemListCtrl as vm',
        templateUrl: 'views/spa-checklist-item-list.html'
      })

      .state ('spaclitems.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'spaclitemEditCtrl as vm',
        templateUrl: 'views/spa-checklist-item-edit.html'
      })
      .state ('spaclitems.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'spaclitemEditCtrl as vm',
        templateUrl: 'views/spa-checklist-item-edit.html'
      })      

      //------------------------------
      // SPA PRESET CHECKLISTS
      //------------------------------
    
      .state ('spapresetcls', {
        data: {
          access: '@'
        },        
        url: '/spapresetcls',
        templateUrl: 'views/common.html'
      })
            
      .state ('spapresetcls.list', {
        data: {
          access: '@'
        },        
        url: '/',
        controller: 'spapresetclListCtrl as vm',
        templateUrl: 'views/spa-preset-checklist-list.html'
      })

      .state ('spapresetcls.edit', {
        data: {
          access: '@'
        },        
        url: '/edit/:id',
        controller: 'spapresetclEditCtrl as vm',
        templateUrl: 'views/spa-preset-checklist-edit.html'
      })
      .state ('spapresetcls.new', {
        data: {
          access: '@'
        },        
        url: '/edit/',
        controller: 'spapresetclEditCtrl as vm',
        templateUrl: 'views/spa-preset-checklist-edit.html'
      })            


      //------------------------------
      // SPA CHECKLIST CALENDAR
      //------------------------------

      .state ('spa-checklist-calendar', {
        data: {
          access: '@'
        },
        url: '/spa-checklist-calendar',
        templateUrl: 'views/spa-checklist-calendar.html',
        controller: 'spapresetclListCtrl as vm',
        resolve: {
          loadPlugin: function($ocLazyLoad) {
            return $ocLazyLoad.load ([
              {
                name: 'css',
                insertBefore: '#app-level',
                files: [
                  'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                ]
              },
            ])
          }
        }
      })      

      //------------------------------
      // LITIGATION CHECKLIST CALENDAR
      //------------------------------

      .state ('litigation-checklist-calendar', {
        data: {
          access: '@'
        },
        url: '/litigation-checklist-calendar',
        templateUrl: 'views/litigation-checklist-calendar.html',
        controller: 'spapresetclListCtrl as vm',
        resolve: {
          loadPlugin: function($ocLazyLoad) {
            return $ocLazyLoad.load ([
              {
                name: 'css',
                insertBefore: '#app-level',
                files: [
                  'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                ]
              },
            ])
          }
        }
      })      
  });