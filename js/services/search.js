materialAdmin
  // =========================================================================
  // Search Data
  // =========================================================================

  .service('searchService', function ($http, Auth) {
    this.getFilter = function () {
      return $http.get('http://43.252.215.81/denningwcf/v1/generalSearch/category')
      .then(function (resp) {
        return resp.data;
      })
    };

    this.search = function (keyword, category) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/generalSearch',
        headers: Auth.isAuthenticated(), 
        params: {
          search: keyword,
          category: category,
          isAutoComplete: 1
        }
      }).then(function(resp) {
        var searchRes = resp.data.map(function(item) {
          var newItem = angular.copy(item);
          try {
            newItem.parseJSON = JSON.parse(item.JSON);
          } catch(err) {
            newItem.parseJSON = '';
          }
          return newItem;
        });
        
        return searchRes;
      });
    };

    this.keyword = function (query) {
      return $http({
        method: 'GET',
        url: 'http://43.252.215.81/denningwcf/v1/generalSearch/keyword',
        headers: Auth.isAuthenticated(), 
        params: {
          search: query
        }
      }).then(function(resp) {
        var results = [];
        resp.data.forEach(function(item){
          results.push({
            value: item.keyword,
            display: item.keyword
          })
        });
        
        return results;
      });
    };
  })

