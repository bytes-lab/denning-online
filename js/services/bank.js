materialAdmin
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('bankService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "code": 10238,
                "name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "company_no": "760105-06-2540",
                "phone": "(382)-122-5003"

            },
            {   
                "code": 10243,
                "name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "company_no": "760105-06-2520",
                "id_type": "New + Old IC",
                "phone": "(477)-981-4948"
            },
            {
                "code": 10248,
                "name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "company_no": "760105-06-2330",
                "id_type": "New + Old IC",
                "phone": "(832)-255-5161"
            },
            {
                "code": 10253,
                "name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "company_no": "760105-32-2540",
                "id_type": "New + Old IC",
                "phone": "(477)-446-3715"
            },
            {
                "code": 10234,
                "name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "company_no": "778805-06-2540",
                "id_type": "New + Old IC",
                "phone": "(813)-716-4996"
                
            },
            {
                "code": 10239,
                "name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "company_no": "2120105-06-2540",
                "id_type": "New + Old IC",
                "phone": "(774)-291-9928"
            },
            {
                "code": 10244,
                "name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "company_no": "760005-06-2540",
                "id_type": "New + Old IC",
                "phone": "(219)-181-7898"
            },
            {
                "code": 10249,
                "name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "company_no": "540105-06-2540",
                "phone": "(647)-209-4589"
            },
            {
                "code": 10237,
                "name": "Claude King",
                "email": "claude.king22@example.com",
                "company_no": "98105-06-2540",
                "id_type": "New + Old IC",
                "phone": "(657)-988-8701"
            },
            {
                "code": 10242,
                "name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "company_no": "767105-06-2540",
                "id_type": "New + Old IC",
                "phone": "(932)-935-9471"
            },
            {
                "code": 10247,
                "name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "company_no": "762225-06-2540",
                "id_type": "New + Old IC",
                "phone": "(857)-459-2792"
            },
            {
                "code": 10252,
                "name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "company_no": "76087-06-2540",
                "id_type": "New + Old IC",
                "phone": "(861)-275-4686"
            },
            {
                "code": 10236,
                "name": "Harold Martinez",
                "email": "martinez67@example.com",
                "company_no": "960105-96-2520",
                "id_type": "New + Old IC",
                "phone": "(836)-634-9133"
            },
            {
                "code": 10241,
                "name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "company_no": "760105-06-2550",
                "id_type": "New + Old IC",
                "phone": "(778)-787-3100"
            },
            {
                "code": 10246,
                "name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "company_no": "760105-26-2540",
                "id_type": "New + Old IC",
                "phone": "(486)-440-4716"
            },
            {
                "code": 10251,
                "name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "company_no": "760605-06-2540",
                "id_type": "New + Old IC",
                "phone": "(342)-510-2258"
            },
            {
                "code": 10235,
                "name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "company_no": "760105-07-2540",
                "id_type": "New + Old IC",
                "phone": "(339)-375-1858"
            },
            {
                "code": 10240,
                "name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "company_no": "760105-76-2540",
                "id_type": "New + Old IC",
                "phone": "(544)-270-9912"
            },
            {
                "code": 10245,
                "name": "Lena Bishop",
                "email": "Lena Bishop",
                "company_no": "550105-06-2540",
                "id_type": "New + Old IC",
                "phone": "(177)-521-1556"
            },
            {
                "code": 10250,
                "name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "company_no": "460105-06-2540",
                "id_type": "New + Old IC",
                "phone": "(506)-533-6801"
            }
        ];

        service.banks = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.banks)
                deferred.resolve(service.banks);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.banks = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(code) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.banks) {
                    service.banks = fakedata;
                }
                var item = service.banks.filter(function(c){
                    return c.code == code;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the code'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(bank) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.banks.map(function(c) {return c.code; }).indexOf(bank.code);
                if(idx != -1) {
                    service.banks[idx] = bank;
                    deferred.resolve(bank);
                } else {
                    service.banks.push(bank);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(bank) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.banks.map(function(c) {return c.code; }).indexOf(bank.code);
                if(idx != -1) {
                    service.banks.splice(idx, 1);
                    deferred.resolve(bank);
                } else {
                    defered.reject(new Error('There is no such bank'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
