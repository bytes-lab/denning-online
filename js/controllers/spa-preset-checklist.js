materialAdmin
    .controller('spapresetclListCtrl', function($filter, $uibModal, NgTableParams, spapresetclService, $state, Auth) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;
        self.userInfo = Auth.getUserInfo();
        self.clickHandler = clickHandler;

        spapresetclService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function clickHandler(item) {
            $state.go('spapresetcls.edit', {'id': item.code});
        }

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
        function modalInstances(animation, size, backdrop, keyboard, spapresetcl) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'SPApresetclDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    spapresetcl: function () {
                        return spapresetcl;
                    },
                    on_list: function () {
                        return true;
                    }                    
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(event, spapresetcl) {
            event.stopPropagation();
            modalInstances(true, '', 'static', true, spapresetcl)
        };        
    })

    .controller('SPApresetclDeleteModalCtrl', function ($scope, $uibModalInstance, spapresetcl, spapresetclService, $state, on_list) {
        $scope.ok = function () {
            spapresetclService.delete(spapresetcl).then(function(spapresetcl) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.spapresetclInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
            if (on_list)
                $state.go('spapresetcls.list');
        };
    })

    .controller('spapresetclEditCtrl', function($filter, $stateParams, spapresetclService, $state, Auth, $uibModal) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.get_code = get_code;
        self.queryBillItems = queryBillItems;
        self.userInfo = Auth.getUserInfo();
        self.openDelete = openDelete;
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

        spapresetclService.getList().then(function(data) {
            self.data = data;
        });        

        function queryBillItems(searchText) {
            return self.data.filter(function(c) {
                return c.code.search(new RegExp(searchText, "i")) > -1;
            });
        }

        if ($stateParams.id) {
            spapresetclService.getItem($stateParams.id)
            .then(function(item){
                self.spapresetcl = angular.copy(item);  // important
            });
        } else {
            self.spapresetcl = {
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
            var idx = self.types.map(function(c) { return c; }).indexOf(self.spapresetcl.type);
            self.spapresetcl.code = 'FDGS'[idx] + Math.floor(Math.random() * 1000 + 1);
        }

        function save() {
            spapresetclService.save(self.spapresetcl).then(function(spapresetcl) {
                self.spapresetcl = spapresetcl;
                $state.go('spapresetcls.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('spapresetcls.list');            
        }

        //Create Modal
        function modalInstances1(animation, size, backdrop, keyboard, spapresetcl) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'SPApresetclDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    spapresetcl: function () {
                        return spapresetcl;
                    }, 
                    on_list: function () {
                        return false;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(event, spapresetcl) {
            event.stopPropagation();
            modalInstances1(true, '', 'static', true, spapresetcl)
        };            
    })
