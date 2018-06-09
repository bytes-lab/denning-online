materialAdmin
    .controller('mukimListCtrl', function($filter, $sce, $uibModal, NgTableParams, mukimService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        mukimService.getList().then(function(data) {
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

                    this.mukim = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.district = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.state = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.mukim, this.district, this.state;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, mukim) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'mukimDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    mukim: function () {
                        return mukim;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(mukim) {
            modalInstances(true, '', 'static', true, mukim)
        };        
    })

    .controller('mukimDeleteModalCtrl', function ($scope, $uibModalInstance, mukim, mukimService, $state) {
        $scope.ok = function () {
            mukimService.delete(mukim).then(function(mukim) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.mukimInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('mukimEditCtrl', function($filter, $stateParams, mukimService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            mukimService.getItem($stateParams.id)
            .then(function(item){
                self.mukim = item;
            });
        } else {
            self.mukim = {};
        }

        function save() {
            mukimService.save(self.mukim).then(function(mukim) {
                self.mukim = mukim;
                $state.go('mukims.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.mukimInfo.$error.push({meessage:''});
            });
        }
    })