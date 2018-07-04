materialAdmin
  // =========================================================================
  // Search Data
  // =========================================================================

  .service('searchService', function (http) {
    this.getFilter = function () {
      return http.GET('/v1/generalSearch/category').then(function (resp) {
        return resp.data;
      })
    };

    this.search = function (keyword, category) {
      return http.GET('/v1/generalSearch', {
          search: keyword,
          category: category,
          isAutoComplete: 1
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
      return http.GET('/v1/generalSearch/keyword', {
        search: query
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

