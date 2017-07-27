materialAdmin
    // =========================================================================
    // DOC TEMPLATE
    // =========================================================================
    
    .service('templateService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
        var service = {};

        function getCategories() {
            if (service.categories) {
                var deferred = $q.defer();
                deferred.resolve(service.categories);
                return deferred.promise;
            } else {
                return $http.get('data/cbotemplatecategory.only')
                .then(function(resp){
                    service.categories = resp.data;                
                    return resp.data;
                })                
            }
        }

        function getTypes(category) {
            var deferred = $q.defer();
            
            if (category == 'Forms' || category == 'Letters') {
                if (service.types[category]) {
                    deferred.resolve(service.types[category]);
                    return deferred.promise;
                } else {
                    return $http.get('data/cbotemplatecategory-filter='+category)
                    .then(function(resp){
                        service.types[category] = resp.data;                
                        return resp.data;
                    })                
                }
            } else {
                deferred.resolve([]);
                return deferred.promise;                
            }
        }

        function getTemplates(category, type, source) {
            var deferred = $q.defer();
            var url = 'cboTemplate-fileno=2000-1077-Online='+source.toLowerCase()+'-category='+category+'-Type='+type;
            var allow_urls = ['cboTemplate-fileno=2000-1077-Online=user-category=Forms-Type=F01',
                 'cboTemplate-fileno=2000-1077-Online=all-category=Letters-Type=L01',
                 'cboTemplate-fileno=2000-1077-Online=online-category=Letters-Type=L01',
                 'cboTemplate-fileno=2000-1077-Online=user-category=Letters-Type=L01'];

            if (allow_urls.indexOf(url) != -1) {           
                if (service.templates[url]) {
                    deferred.resolve(service.templates[url]);
                    return deferred.promise;
                } else {
                    return $http.get('data/'+url)
                    .then(function(resp){
                        service.templates[url] = resp.data;                
                        return resp.data;
                    })                
                }
            } else {
                deferred.resolve([]);
                return deferred.promise;                
            }
        }

        service.templates = {};
        service.types = {};
        service.getCategories = getCategories;
        service.getTypes = getTypes;
        service.getTemplates = getTemplates;

        return service;        
    }])
