denningOnline
  // =========================================================================
  // Contacts
  // =========================================================================
  
  .service('contactService', function (http) {
    var service = {};

    service.getList = function (page=1, pagesize=25, keyword='') {
      return http.GET('/v1/party?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });
    }

    service.getStaffList = function (page=1, pagesize=25, keyword='') {
      return http.GET('/v1/table/Staff?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });
    };

    service.getCustomerList = function (page=1, pagesize=25, keyword='') {
      return http.GET('/v1/table/Customer?page='+page+'&pagesize='+pagesize+'&search='+keyword).then(function(resp) {
        return resp;
      });
    };

    service.getItem = function (code) {
      return http.GET('/v1/table/Customer/'+code).then(function(resp) {
        return resp.data;
      });
    }

    service.getIDTypeList = function () {
      return http.GET('/v1/table/IDType').then(function(resp) {
        return resp.data;
      });
    }

    service.getSalutationList = function () {
      return http.GET('/v1/Salutation').then(function(resp) {
        return resp.data;
      });
    }

    service.upload = function (info, type) {
      var url;
      if (type == 'contact') {
        url = '/v1/app/contactFolder';
      } else {
        url = '/v1/app/matter/fileFolder';
      }

      return http.POST(url, info).then(function(resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      if (entity.code) {
        return http.PUT('/v1/table/Customer', entity).then(function(response) {
          return response ? response.data : null;
        });
      } else {
        return http.POST('/v1/table/Customer', entity).then(function(response) {
          return response ? response.data : null;
        });
      }
    }

    service.delete = function (contact) {
    }
    
    return service;
  })
