denningOnline
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('loanTypeService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "new_ic": "760105-06-2540",
                "phone3": "(382)-122-5003",

                "id_type": "New + Old IC",
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
                "contact_person": "Contact Me",
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
                "email": "glen.curtis11@example.com",
                "new_ic": "760105-06-2520",
                "id_type": "New + Old IC",
                "phone3": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "new_ic": "760105-06-2330",
                "id_type": "New + Old IC",
                "phone3": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "new_ic": "760105-32-2540",
                "id_type": "New + Old IC",
                "phone3": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "new_ic": "778805-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "new_ic": "2120105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "new_ic": "760005-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "new_ic": "540105-06-2540",
                "phone3": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "email": "claude.king22@example.com",
                "new_ic": "98105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "new_ic": "767105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "new_ic": "762225-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "new_ic": "76087-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "email": "martinez67@example.com",
                "new_ic": "960105-96-2520",
                "id_type": "New + Old IC",
                "phone3": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "new_ic": "760105-06-2550",
                "id_type": "New + Old IC",
                "phone3": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "new_ic": "760105-26-2540",
                "id_type": "New + Old IC",
                "phone3": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "new_ic": "760605-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "new_ic": "760105-07-2540",
                "id_type": "New + Old IC",
                "phone3": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "new_ic": "760105-76-2540",
                "id_type": "New + Old IC",
                "phone3": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "email": "Lena Bishop",
                "new_ic": "550105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "new_ic": "460105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(506)-533-6801"
            }
        ];

        service.contacts = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.contacts)
                deferred.resolve(service.contacts);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.contacts = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(new_ic) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.contacts) {
                    service.contacts = fakedata;
                }
                var item = service.contacts.filter(function(c){
                    return c.new_ic == new_ic;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the new_ic'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(contact) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.contacts.map(function(c) {return c.new_ic; }).indexOf(contact.new_ic);
                if(idx != -1) {
                    service.contacts[idx] = contact;
                    deferred.resolve(contact);
                } else {
                    service.contacts.push(contact);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(contact) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.contacts.map(function(c) {return c.new_ic; }).indexOf(contact.new_ic);
                if(idx != -1) {
                    service.contacts.splice(idx, 1);
                    deferred.resolve(contact);
                } else {
                    deferred.reject(new Error('There is no such contact'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
