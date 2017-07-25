materialAdmin
    .controller('IRDBranchListCtrl', function($filter, $sce, $uibModal, NgTableParams, IRDBranchService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        IRDBranchService.getList().then(function(data) {
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

                    this.branch = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.town = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.phone1 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.fax = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.branch, this.town, this.phone1, this.fax;
                }
            })      
        }

        self.modalContent = 'Are you sure to delete the IRD Branch?';
    
        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, IRDBranch) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'IRDBranchDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    IRDBranch: function () {
                        return IRDBranch;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(IRDBranch) {
            modalInstances(true, '', 'static', true, IRDBranch)
        };        
    })

    .controller('IRDBranchDeleteModalCtrl', function ($scope, $modalInstance, IRDBranch, IRDBranchService, $state) {
        $scope.ok = function () {
            IRDBranchService.delete(IRDBranch).then(function(IRDBranch) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.IRDBranchInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('IRDBranchEditCtrl', function($filter, $stateParams, IRDBranchService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            IRDBranchService.getItem($stateParams.id)
            .then(function(item){
                self.IRDBranch = item;
            });
        } else {
            self.IRDBranch = {};
        }

        function save() {
            IRDBranchService.save(self.IRDBranch).then(function(IRDBranch) {
                self.IRDBranch = IRDBranch;
                $state.go('IRD-branches.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.IRDBranchInfo.$error.push({meessage:''});
            });
        }
    })