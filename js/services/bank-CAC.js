materialAdmin
    // =========================================================================
    // Bank CACs
    // =========================================================================
    
    .service('bankCACService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "CAC_name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "manager_IC_no": "760105-06-2540",
                "phone3": "(382)-122-5003",

                "master_bank_code": "PBB",
                "address1": " 178, Kampung Baru,",
                "address2": "",
                "address3": "",
                "postcode": "28300",
                "town": "Mentakab",
                "state": "Pahang",
                "country": "Malaysia",
                "phone1": "(09)2554-558",
                "phone2": "",
                "fax": "",
                "website": ""
            },
            {   
                "id": 10243,
                "CAC_name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "manager_IC_no": "760105-06-2520",
                "master_bank_code": "PBB",
                "phone3": "(477)-981-4948"
            },
            {
                "id": 10248,
                "CAC_name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "manager_IC_no": "760105-06-2330",
                "master_bank_code": "PBB",
                "phone3": "(832)-255-5161"
            },
            {
                "id": 10253,
                "CAC_name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "manager_IC_no": "760105-32-2540",
                "master_bank_code": "PBB",
                "phone3": "(477)-446-3715"
            },
            {
                "id": 10234,
                "CAC_name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "manager_IC_no": "778805-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "CAC_name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "manager_IC_no": "2120105-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(774)-291-9928"
            },
            {
                "id": 10244,
                "CAC_name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "manager_IC_no": "760005-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(219)-181-7898"
            },
            {
                "id": 10249,
                "CAC_name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "manager_IC_no": "540105-06-2540",
                "phone3": "(647)-209-4589"
            },
            {
                "id": 10237,
                "CAC_name": "Claude King",
                "email": "claude.king22@example.com",
                "manager_IC_no": "98105-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(657)-988-8701"
            },
            {
                "id": 10242,
                "CAC_name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "manager_IC_no": "767105-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(932)-935-9471"
            },
            {
                "id": 10247,
                "CAC_name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "manager_IC_no": "762225-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(857)-459-2792"
            },
            {
                "id": 10252,
                "CAC_name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "manager_IC_no": "76087-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(861)-275-4686"
            },
            {
                "id": 10236,
                "CAC_name": "Harold Martinez",
                "email": "martinez67@example.com",
                "manager_IC_no": "960105-96-2520",
                "master_bank_code": "PBB",
                "phone3": "(836)-634-9133"
            },
            {
                "id": 10241,
                "CAC_name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "manager_IC_no": "760105-06-2550",
                "master_bank_code": "PBB",
                "phone3": "(778)-787-3100"
            },
            {
                "id": 10246,
                "CAC_name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "manager_IC_no": "760105-26-2540",
                "master_bank_code": "PBB",
                "phone3": "(486)-440-4716"
            },
            {
                "id": 10251,
                "CAC_name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "manager_IC_no": "760605-06-2540",
                "master_bank_code": "PBB",
                "phone3": "(342)-510-2258"
            }
        ];

        service.bank_CACs = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.bank_CACs)
                deferred.resolve(service.bank_CACs);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.bank_CACs = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.bank_CACs) {
                    service.bank_CACs = fakedata;
                }
                var item = service.bank_CACs.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the CAC_name'));
            }, 100);

            return deferred.promise;
        }

        function save(bank_CAC) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.bank_CACs.map(function(c) {return c.CAC_name; }).indexOf(bank_CAC.CAC_name);
                if(idx != -1) {
                    service.bank_CACs[idx] = bank_CAC;
                    deferred.resolve(bank_CAC);
                } else {
                    service.bank_CACs.push(bank_CAC);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(bank_CAC) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.bank_CACs.map(function(c) {return c.CAC_name; }).indexOf(bank_CAC.CAC_name);
                if(idx != -1) {
                    service.bank_CACs.splice(idx, 1);
                    deferred.resolve(bank_CAC);
                } else {
                    deferred.reject(new Error('There is no such bank_CAC'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
