materialAdmin
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('legalFirmService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "firm_name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "title": "760105-06-2540",
                "phone2": "(382)-122-5003",

                "id_type": "New + Old IC",
                "old_ic": "A33440078",
                "address1": " 178, Kampung Baru,",
                "address2": "",
                "address3": "",
                "postcode": "28300",
                "town": "Mentakab",
                "state": "Pahang",
                "country": "Malaysia",
                "phone1": "(09)2554-558",
                "fax": "",
                "website": ""                
            },
            {   
                "id": 10243,
                "firm_name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "title": "760105-06-2520",
                "id_type": "New + Old IC",
                "phone2": "(477)-981-4948"
            },
            {
                "id": 10248,
                "firm_name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "title": "760105-06-2330",
                "id_type": "New + Old IC",
                "phone2": "(832)-255-5161"
            },
            {
                "id": 10253,
                "firm_name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "title": "760105-32-2540",
                "id_type": "New + Old IC",
                "phone2": "(477)-446-3715"
            },
            {
                "id": 10234,
                "firm_name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "title": "778805-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "firm_name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "title": "2120105-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(774)-291-9928"
            },
            {
                "id": 10244,
                "firm_name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "title": "760005-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(219)-181-7898"
            },
            {
                "id": 10249,
                "firm_name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "title": "540105-06-2540",
                "phone2": "(647)-209-4589"
            },
            {
                "id": 10237,
                "firm_name": "Claude King",
                "email": "claude.king22@example.com",
                "title": "98105-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(657)-988-8701"
            },
            {
                "id": 10242,
                "firm_name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "title": "767105-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(932)-935-9471"
            },
            {
                "id": 10247,
                "firm_name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "title": "762225-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(857)-459-2792"
            },
            {
                "id": 10252,
                "firm_name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "title": "76087-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(861)-275-4686"
            },
            {
                "id": 10236,
                "firm_name": "Harold Martinez",
                "email": "martinez67@example.com",
                "title": "960105-96-2520",
                "id_type": "New + Old IC",
                "phone2": "(836)-634-9133"
            },
            {
                "id": 10241,
                "firm_name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "title": "760105-06-2550",
                "id_type": "New + Old IC",
                "phone2": "(778)-787-3100"
            },
            {
                "id": 10246,
                "firm_name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "title": "760105-26-2540",
                "id_type": "New + Old IC",
                "phone2": "(486)-440-4716"
            },
            {
                "id": 10251,
                "firm_name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "title": "760605-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(342)-510-2258"
            },
            {
                "id": 10235,
                "firm_name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "title": "760105-07-2540",
                "id_type": "New + Old IC",
                "phone2": "(339)-375-1858"
            },
            {
                "id": 10240,
                "firm_name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "title": "760105-76-2540",
                "id_type": "New + Old IC",
                "phone2": "(544)-270-9912"
            },
            {
                "id": 10245,
                "firm_name": "Lena Bishop",
                "email": "Lena Bishop",
                "title": "550105-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(177)-521-1556"
            },
            {
                "id": 10250,
                "firm_name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "title": "460105-06-2540",
                "id_type": "New + Old IC",
                "phone2": "(506)-533-6801"
            }
        ];

        service.lefalFirms = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.lefalFirms)
                deferred.resolve(service.lefalFirms);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.lefalFirms = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.lefalFirms) {
                    service.lefalFirms = fakedata;
                }
                var item = service.lefalFirms.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(legalFirm) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.lefalFirms.map(function(c) {return c.id; }).indexOf(legalFirm.id);
                if(idx != -1) {
                    service.lefalFirms[idx] = legalFirm;
                    deferred.resolve(legalFirm);
                } else {
                    service.lefalFirms.push(legalFirm);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(legalFirm) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.lefalFirms.map(function(c) {return c.id; }).indexOf(legalFirm.id);
                if(idx != -1) {
                    service.lefalFirms.splice(idx, 1);
                    deferred.resolve(legalFirm);
                } else {
                    defered.reject(new Error('There is no such legal firm'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
