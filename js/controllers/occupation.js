materialAdmin
    .controller('occupationListCtrl', function($filter, $sce, $uibModal, NgTableParams, occupationService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        occupationService.getList().then(function(data) {
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

                    this.title_eng = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.title_mal = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.title_eng, this.title_mal;
                }
            })      
        }

        self.modalContent = 'Are you sure to delete the contract?';
    
        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, occupation) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'occupationDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    occupation: function () {
                        return occupation;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(occupation) {
            modalInstances(true, '', 'static', true, occupation)
        };        
    })

    .controller('occupationDeleteModalCtrl', function ($scope, $uibModalInstance, occupation, occupationService, $state) {
        $scope.ok = function () {
            occupationService.delete(occupation).then(function(occupation) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.occupationInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('occupationEditCtrl', function($filter, $stateParams, occupationService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            occupationService.getItem($stateParams.id)
            .then(function(item){
                self.occupation = item;
            });
        } else {
            self.occupation = {};
        }

        function save() {
            occupationService.save(self.occupation).then(function(occupation) {
                self.occupation = occupation;
                $state.go('occupations.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.occupationInfo.$error.push({meessage:''});
            });
        }
    })