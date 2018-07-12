denningOnline
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('cityService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "city": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "postcode": "760105-06-2540",
                "phone3": "(382)-122-5003",
                "state": "Pahang",
                "country": "Malaysia"
            },
            {   
                "id": 10243,
                "city": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "postcode": "760105-06-2520",
                "state": "New + Old IC",
                "phone3": "(477)-981-4948"
            },
            {
                "id": 10248,
                "city": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "postcode": "760105-06-2330",
                "state": "New + Old IC",
                "phone3": "(832)-255-5161"
            },
            {
                "id": 10253,
                "city": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "postcode": "760105-32-2540",
                "state": "New + Old IC",
                "phone3": "(477)-446-3715"
            },
            {
                "id": 10234,
                "city": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "postcode": "778805-06-2540",
                "state": "New + Old IC",
                "phone3": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "city": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "postcode": "2120105-06-2540",
                "state": "New + Old IC",
                "phone3": "(774)-291-9928"
            },
            {
                "id": 10244,
                "city": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "postcode": "760005-06-2540",
                "state": "New + Old IC",
                "phone3": "(219)-181-7898"
            },
            {
                "id": 10249,
                "city": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "postcode": "540105-06-2540",
                "phone3": "(647)-209-4589"
            },
            {
                "id": 10237,
                "city": "Claude King",
                "email": "claude.king22@example.com",
                "postcode": "98105-06-2540",
                "state": "New + Old IC",
                "phone3": "(657)-988-8701"
            },
            {
                "id": 10242,
                "city": "Roland Craig",
                "email": "roland.craig47@example.com",
                "postcode": "767105-06-2540",
                "state": "New + Old IC",
                "phone3": "(932)-935-9471"
            },
            {
                "id": 10247,
                "city": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "postcode": "762225-06-2540",
                "state": "New + Old IC",
                "phone3": "(857)-459-2792"
            },
            {
                "id": 10252,
                "city": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "postcode": "76087-06-2540",
                "state": "New + Old IC",
                "phone3": "(861)-275-4686"
            },
            {
                "id": 10236,
                "city": "Harold Martinez",
                "email": "martinez67@example.com",
                "postcode": "960105-96-2520",
                "state": "New + Old IC",
                "phone3": "(836)-634-9133"
            },
            {
                "id": 10241,
                "city": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "postcode": "760105-06-2550",
                "state": "New + Old IC",
                "phone3": "(778)-787-3100"
            },
            {
                "id": 10246,
                "city": "Charles Walker",
                "email": "charles.walker90@example.com",
                "postcode": "760105-26-2540",
                "state": "New + Old IC",
                "phone3": "(486)-440-4716"
            },
            {
                "id": 10251,
                "city": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "postcode": "760605-06-2540",
                "state": "New + Old IC",
                "phone3": "(342)-510-2258"
            },
            {
                "id": 10235,
                "city": "Genesis Reynolds",
                "email": "genesis@example.com",
                "postcode": "760105-07-2540",
                "state": "New + Old IC",
                "phone3": "(339)-375-1858"
            },
            {
                "id": 10240,
                "city": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "postcode": "760105-76-2540",
                "state": "New + Old IC",
                "phone3": "(544)-270-9912"
            },
            {
                "id": 10245,
                "city": "Lena Bishop",
                "email": "Lena Bishop",
                "postcode": "550105-06-2540",
                "state": "New + Old IC",
                "phone3": "(177)-521-1556"
            },
            {
                "id": 10250,
                "city": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "postcode": "460105-06-2540",
                "state": "New + Old IC",
                "phone3": "(506)-533-6801"
            }
        ];

        service.cities = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.cities)
                deferred.resolve(service.cities);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.cities = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.cities) {
                    service.cities = fakedata;
                }
                var item = service.cities.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(city) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.cities.map(function(c) {return c.id; }).indexOf(city.id);
                if(idx != -1) {
                    service.cities[idx] = city;
                    deferred.resolve(city);
                } else {
                    service.cities.push(city);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(city) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.cities.map(function(c) {return c.id; }).indexOf(city.id);
                if(idx != -1) {
                    service.cities.splice(idx, 1);
                    deferred.resolve(city);
                } else {
                    deferred.reject(new Error('There is no such city'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
