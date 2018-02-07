materialAdmin
    .controller('propertyListCtrl', function($filter, $sce, $uibModal, NgTableParams, propertyService, $state, Auth) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;
        self.clickHandler = clickHandler;
        self.userInfo = Auth.getUserInfo();

        propertyService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function clickHandler(item) {
            $state.go('properties.edit', {'id': item.new_ic});
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

        self.modalContent = 'Are you sure to delete the contract?';
    
        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, property) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'propertyDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    property: function () {
                        return property;
                    }, 
                    on_list: function () {
                        return true;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(event, property) {
            event.stopPropagation();
            modalInstances(true, '', 'static', true, property)
        };        
    })

    .controller('propertyDeleteModalCtrl', function ($scope, $modalInstance, property, propertyService, $state) {
        $scope.ok = function () {
            propertyService.delete(property).then(function(property) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.propertyInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.close();
            if (on_list)
                $state.go('propertys.list');            
        };
    })

    .controller('propertyEditCtrl', function($filter, $stateParams, propertyService, $state, Auth, $uibModal) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create
        self.userInfo = Auth.getUserInfo();
        self.openDelete = openDelete;
        self.can_edit = false;

        if($stateParams.id) {
            propertyService.getItem($stateParams.id)
            .then(function(item){
                self.property = item;
            });
        } else {
            self.property = {};
        }

        function save() {
            propertyService.save(self.property).then(function(property) {
                self.property = property;
                $state.go('properties.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.propertyInfo.$error.push({meessage:''});
            });
        }

        function cancel() {
            $state.go('properties.list');            
        }

        //Create Modal
        function modalInstances1(animation, size, backdrop, keyboard, property) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'propertyDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    property: function () {
                        return property;
                    }, 
                    on_list: function () {
                        return false;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(event, property) {
            event.stopPropagation();
            modalInstances1(true, '', 'static', true, property)
        };        

    })