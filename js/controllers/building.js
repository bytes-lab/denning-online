denningOnline
    .controller('buildingListCtrl', function($filter, $sce, $uibModal, NgTableParams, buildingService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        buildingService.getList().then(function(data) {
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

                    this.code = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.bc_type = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.type = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.code, this.bc_type, this.type;
                }
            })      
        }

        self.modalContent = 'Are you sure to delete the building?';
    
        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, building) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'buildingDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    building: function () {
                        return building;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(building) {
            modalInstances(true, '', 'static', true, building)
        };        
    })

    .controller('buildingDeleteModalCtrl', function ($scope, $uibModalInstance, building, buildingService, $state) {
        $scope.ok = function () {
            buildingService.delete(building).then(function(building) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.buildingInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('buildingEditCtrl', function($filter, $stateParams, buildingService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            buildingService.getItem($stateParams.id)
            .then(function(item){
                self.building = item;
            });
        } else {
            self.building = {};
        }

        function save() {
            buildingService.save(self.building).then(function(building) {
                self.building = building;
                $state.go('buildings.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.buildingInfo.$error.push({meessage:''});
            });
        }
    })