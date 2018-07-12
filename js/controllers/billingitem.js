denningOnline
    .controller('billingitemListCtrl', function($filter, $uibModal, NgTableParams, billingitemService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        billingitemService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function initializeTable () {
            //Filtering
            self.tableFilter = new NgTableParams({
                page: 1,            // show first page
                count: 10,
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: self.data.length, // length of data
                getData: function(params) {
                    // use build-in angular filter
                    var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    params.total(orderedData.length); // set total for recalc pagination
                    return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, billingitem) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'BillingitemDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    billingitem: function () {
                        return billingitem;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(billingitem) {
            modalInstances(true, '', 'static', true, billingitem)
        };        
    })

    .controller('BillingitemDeleteModalCtrl', function ($scope, $uibModalInstance, billingitem, billingitemService, $state) {
        $scope.ok = function () {
            billingitemService.delete(billingitem).then(function(billingitem) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.billingitemInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
            $state.go('billingitems.list');
        };
    })

    .controller('billingitemEditCtrl', function($filter, $stateParams, billingitemService, $state) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.get_code = get_code;
        self.queryBillItems = queryBillItems;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create
        self.types = [
            'Professional Fee',
            'Disbursement',
            'Disb. with GST',
            'Service Tax'
        ];

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

        billingitemService.getList().then(function(data) {
            self.data = data;
        });        

        function queryBillItems(searchText) {
            return self.data.filter(function(c) {
                return c.code.search(new RegExp(searchText, "i")) > -1;
            });
        }

        if ($stateParams.id) {
            billingitemService.getItem($stateParams.id)
            .then(function(item){
                self.billingitem = angular.copy(item);  // important
            });
        } else {
            self.billingitem = {
                type: self.types[0],
                code: 'F' + Math.floor(Math.random() * 1000 + 1),
                priority: 1,
                state: 'Common',
                category: 'Conveyancing',
                invoice: {
                    price: 0.00,
                    unit: 1.00
                },
                voucher: {
                    price: 0.00,
                    unit: 0.00
                }
            };
        }

        function get_code() {
            if ($stateParams.id) 
                return;
            // get from server
            var idx = self.types.map(function(c) { return c; }).indexOf(self.billingitem.type);
            self.billingitem.code = 'FDGS'[idx] + Math.floor(Math.random() * 1000 + 1);
        }

        function save() {
            billingitemService.save(self.billingitem).then(function(billingitem) {
                self.billingitem = billingitem;
                $state.go('billingitems.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('billingitems.list');            
        }
    })
