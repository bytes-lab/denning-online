denningOnline
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('bankAttorneyService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "bank": "marc.barnes54@example.com",
                "ic": "760105-06-2540",
                "phone3": "(382)-122-5003",
                "state": "New + Old IC"
            },
            {   
                "id": 10243,
                "name": "Glen Curtis",
                "bank": "glen.curtis11@example.com",
                "ic": "760105-06-2520",
                "state": "New + Old IC",
                "phone3": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "bank": "beverly.gonzalez54@example.com",
                "ic": "760105-06-2330",
                "state": "New + Old IC",
                "phone3": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "bank": "yvonne.chavez@example.com",
                "ic": "760105-32-2540",
                "state": "New + Old IC",
                "phone3": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "bank": "melinda@example.com",
                "ic": "778805-06-2540",
                "state": "New + Old IC",
                "phone3": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "bank": "shannon.bradley42@example.com",
                "ic": "2120105-06-2540",
                "state": "New + Old IC",
                "phone3": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "bank": "virgil.kim81@example.com",
                "ic": "760005-06-2540",
                "state": "New + Old IC",
                "phone3": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "bank": "letitia.rober@example.com",
                "ic": "540105-06-2540",
                "phone3": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "bank": "claude.king22@example.com",
                "ic": "98105-06-2540",
                "state": "New + Old IC",
                "phone3": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "bank": "roland.craig47@example.com",
                "ic": "767105-06-2540",
                "state": "New + Old IC",
                "phone3": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "bank": "colleen.parker38@example.com",
                "ic": "762225-06-2540",
                "state": "New + Old IC",
                "phone3": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "bank": "leah.jensen27@example.com",
                "ic": "76087-06-2540",
                "state": "New + Old IC",
                "phone3": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "bank": "martinez67@example.com",
                "ic": "960105-96-2520",
                "state": "New + Old IC",
                "phone3": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "bank": "keith.lowe96@example.com",
                "ic": "760105-06-2550",
                "state": "New + Old IC",
                "phone3": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "bank": "charles.walker90@example.com",
                "ic": "760105-26-2540",
                "state": "New + Old IC",
                "phone3": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "bank": "lillie.curtis12@example.com",
                "ic": "760605-06-2540",
                "state": "New + Old IC",
                "phone3": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "bank": "genesis@example.com",
                "ic": "760105-07-2540",
                "state": "New + Old IC",
                "phone3": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "bank": "oscar.palmer24@example.com",
                "ic": "760105-76-2540",
                "state": "New + Old IC",
                "phone3": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "bank": "Lena Bishop",
                "ic": "550105-06-2540",
                "state": "New + Old IC",
                "phone3": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "bank": "kent.nguyen34@example.com",
                "ic": "460105-06-2540",
                "state": "New + Old IC",
                "phone3": "(506)-533-6801"
            }
        ];

        service.bankAttorneys = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.bankAttorneys)
                deferred.resolve(service.bankAttorneys);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.bankAttorneys = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.bankAttorneys) {
                    service.bankAttorneys = fakedata;
                }
                var item = service.bankAttorneys.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(bankAttorney) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.bankAttorneys.map(function(c) {return c.id; }).indexOf(bankAttorney.id);
                if(idx != -1) {
                    service.bankAttorneys[idx] = bankAttorney;
                    deferred.resolve(bankAttorney);
                } else {
                    service.bankAttorneys.push(bankAttorney);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(bankAttorney) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.bankAttorneys.map(function(c) {return c.id; }).indexOf(bankAttorney.id);
                if(idx != -1) {
                    service.bankAttorneys.splice(idx, 1);
                    deferred.resolve(bankAttorney);
                } else {
                    deferred.reject(new Error('There is no such bank attorney'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
