materialAdmin
    .controller('presetbillListCtrl', function($filter, $uibModal, NgTableParams, presetbillService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        presetbillService.getList().then(function(data) {
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
        function modalInstances(animation, size, backdrop, keyboard, presetbill) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    presetbill: function () {
                        return presetbill;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(presetbill) {
            modalInstances(true, '', 'static', true, presetbill)
        };        
    })

    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, presetbill, presetbillService, $state) {
        $scope.ok = function () {
            presetbillService.delete(presetbill).then(function(presetbill) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.presetbillInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.close();
            $state.go('presetbills.list');
        };
    })

    .controller('presetbillEditCtrl', function($filter, $stateParams, presetbillService, $state) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create

        if ($stateParams.id) {
            presetbillService.getItem($stateParams.id)
            .then(function(item){
                self.presetbill = angular.copy(item);  // important
            });
        } else {
            self.presetbill = {};
        }

        function save() {
            presetbillService.save(self.presetbill).then(function(presetbill) {
                self.presetbill = presetbill;
                $state.go('presetbills.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('presetbills.list');            
        }
    })
