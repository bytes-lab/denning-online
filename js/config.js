// materialAdmin.config(['$httpProvider', function ($httpProvider) {
//   //Reset headers to avoid OPTIONS request (aka preflight)
//   $httpProvider.defaults.headers.common = {};
//   $httpProvider.defaults.headers.post = {};
//   $httpProvider.defaults.headers.put = {};
//   $httpProvider.defaults.headers.patch = {};
//   $httpProvider.defaults.headers.options = {};
// }]);

materialAdmin
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
                templateUrl: 'views/overview.html',
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
                                insertBefore: '#app-level-js',
                                files: [
                                    'vendors/sparklines/jquery.sparkline.min.js',
                                    'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                    'vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                                ]
                            }
                        ])
                    }
                }
            })


            //------------------------------
            // MATTER FORM
            //------------------------------
            .state ('matterforms', {
                data: {
                    access: '@'
                },                
                url: '/matterforms',
                templateUrl: 'views/common.html'
            })

            .state ('matterforms.edit', {
                data: {
                    access: '@'
                },                
                url: '/edit',
                controller: 'matterformEditCtrl as vm',
                templateUrl: 'views/matterform_edit.html'
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
                    access: '@'
                },                
                url: '/edit/',
                controller: 'contactEditCtrl as vm',
                templateUrl: 'views/contact-edit.html'
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
                    access: '@'
                },                
                url: '/edit/new',
                controller: 'propertyEditCtrl as vm',
                templateUrl: 'views/property-edit.html'
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
                url: '/edit/new',
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
                    access: '@'
                },                
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
                controller: 'bankEditCtrl as vm',
                templateUrl: 'views/bank-edit.html'
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
                    access: '@'
                },                
                url: '/edit/new',
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
                url: '/edit/new',
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
                    access: '@'
                },                
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
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
                    access: '@'
                },                
                url: '/edit/new',
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
                    access: '@'
                },                
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
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
                url: '/edit/new',
                controller: 'CKHTEditCtrl as vm',
                templateUrl: 'views/CKHT-edit.html'
            })                                                  
    });

