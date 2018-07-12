denningOnline
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('judgeService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "title1": "marc.barnes54@example.com",
                "id": "760105-06-2540",
                "position": "(382)-122-5003",

                "title2": "New + Old IC",
                "old_ic": "A33440078",
                "title": "Mr.",
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
                "website": "",
                "citizenship": "Malaysia Citizen",
                "dob": "02/04/1976",
                "marital_status": "",
                "num_children": "",
                "occupation": "Rubber Tapper",
                "tax_file_no": "Tax4235",
                "IRD_branch": "Alor Setar",
                "customer_type": "",
                "government_department": "",
                "GST_status_verified": true,
                "last_GST_status_verified_date": "",
                "GST_registered": true,
                "GST_reg_no": "",
                "RMCD_approval_no": "",
                "mailing_list": "",
                "newsletter": true,
                "office_address": "",
                "director1": "",
                "director2": "",
                "secretary": "",
                "judge_person": "Contact Me",
                "spouse_name": "",
                "spouse_occupation": "",
                "race": "",
                "religion": "",
                "sex": "",
                "monthly_income": "USD3,000",
                "place_of_work": "",
                "education_level": "",
                "institution": "",
                "extra1": "",
                "extra2": "",
                "extra3": "",
                "extra4": "",
                "extra5": "",
                "corespondence_address": "",
                "extra_address1": "",
                "extra_address2": "",
                "extra_address3": "",
                "entered_by": "APP test",
                "entered_date": "27/06/2017",
                "updated_by": "",
                "updated_date": "",
                "add_to_favorites": false,
                "remarks": "",
                "deceased": false
            },
            {   
                "id": 10243,
                "name": "Glen Curtis",
                "title1": "glen.curtis11@example.com",
                "id": "760105-06-2520",
                "title2": "New + Old IC",
                "position": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "title1": "beverly.gonzalez54@example.com",
                "id": "760105-06-2330",
                "title2": "New + Old IC",
                "position": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "title1": "yvonne.chavez@example.com",
                "id": "760105-32-2540",
                "title2": "New + Old IC",
                "position": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "title1": "melinda@example.com",
                "id": "778805-06-2540",
                "title2": "New + Old IC",
                "position": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "title1": "shannon.bradley42@example.com",
                "id": "2120105-06-2540",
                "title2": "New + Old IC",
                "position": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "title1": "virgil.kim81@example.com",
                "id": "760005-06-2540",
                "title2": "New + Old IC",
                "position": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "title1": "letitia.rober@example.com",
                "id": "540105-06-2540",
                "position": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "title1": "claude.king22@example.com",
                "id": "98105-06-2540",
                "title2": "New + Old IC",
                "position": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "title1": "roland.craig47@example.com",
                "id": "767105-06-2540",
                "title2": "New + Old IC",
                "position": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "title1": "colleen.parker38@example.com",
                "id": "762225-06-2540",
                "title2": "New + Old IC",
                "position": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "title1": "leah.jensen27@example.com",
                "id": "76087-06-2540",
                "title2": "New + Old IC",
                "position": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "title1": "martinez67@example.com",
                "id": "960105-96-2520",
                "title2": "New + Old IC",
                "position": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "title1": "keith.lowe96@example.com",
                "id": "760105-06-2550",
                "title2": "New + Old IC",
                "position": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "title1": "charles.walker90@example.com",
                "id": "760105-26-2540",
                "title2": "New + Old IC",
                "position": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "title1": "lillie.curtis12@example.com",
                "id": "760605-06-2540",
                "title2": "New + Old IC",
                "position": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "title1": "genesis@example.com",
                "id": "760105-07-2540",
                "title2": "New + Old IC",
                "position": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "title1": "oscar.palmer24@example.com",
                "id": "760105-76-2540",
                "title2": "New + Old IC",
                "position": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "title1": "Lena Bishop",
                "id": "550105-06-2540",
                "title2": "New + Old IC",
                "position": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "title1": "kent.nguyen34@example.com",
                "id": "460105-06-2540",
                "title2": "New + Old IC",
                "position": "(506)-533-6801"
            }
        ];

        service.judges = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.judges)
                deferred.resolve(service.judges);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.judges = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.judges) {
                    service.judges = fakedata;
                }
                var item = service.judges.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(judge) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.judges.map(function(c) {return c.id; }).indexOf(judge.id);
                if(idx != -1) {
                    service.judges[idx] = judge;
                    deferred.resolve(judge);
                } else {
                    service.judges.push(judge);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(judge) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.judges.map(function(c) {return c.id; }).indexOf(judge.id);
                if(idx != -1) {
                    service.judges.splice(idx, 1);
                    deferred.resolve(judge);
                } else {
                    deferred.reject(new Error('There is no such judge'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
