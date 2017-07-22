materialAdmin
    .controller('contactListCtrl', function($filter, $sce, NgTableParams, contactService) {
        var self = this;
        self.dataReady = false;

        contactService.getList().then(function(data) {
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

                    this.id = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.username = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.contact = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.id, this.name, this.email, this.username, this.contact;
                }
            })      
        }
    })

    .controller('contactEditCtrl', function($filter, $stateParams, contactService, $state) {
        var self = this;
        if($stateParams.id) {
            contactService.getItem($stateParams.id)
            .then(function(item){
                self.contact = item;
            });
        } else {
            self.contact = {};
        }
        self.save = save;

        function save() {
            contactService.save(self.contact).then(function(contact) {
                self.contact = contact;
                $state.go('contacts.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.contactInfo.$error.push({meessage:''});
            });
        }
    })