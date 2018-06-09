materialAdmin
    .controller('judgeListCtrl', function($filter, $sce, $uibModal, NgTableParams, judgeService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        judgeService.getList().then(function(data) {
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

                    this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.title1 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.title2 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.position = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.name, this.title1, this.title2, this.position;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, judge) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'judgeDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    judge: function () {
                        return judge;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(judge) {
            modalInstances(true, '', 'static', true, judge)
        };        
    })

    .controller('judgeDeleteModalCtrl', function ($scope, $uibModalInstance, judge, judgeService, $state) {
        $scope.ok = function () {
            judgeService.delete(judge).then(function(judge) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.judgeInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('judgeEditCtrl', function($filter, $stateParams, judgeService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            judgeService.getItem($stateParams.id)
            .then(function(item){
                self.judge = item;
            });
        } else {
            self.judge = {};
        }

        function save() {
            judgeService.save(self.judge).then(function(judge) {
                self.judge = judge;
                $state.go('judges.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.judgeInfo.$error.push({meessage:''});
            });
        }
    })