denningOnline
  // =========================================================================
  // Contacts
  // =========================================================================
  
  .service('contactService', function (http) {
    var service = {};

    service.getList = function (page, pagesize, keyword) {
      return http.GET('v1/party', {
        page: page,
        pagesize: pagesize,
        search: keyword 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getCustomerList = function (page, pagesize, keyword) {
      return http.GET('v1/table/Customer', {
        page: page,
        pagesize: pagesize,
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    };

    service.getItem = function (code) {
      return http.GET('v1/table/Customer/'+code).then(function (resp) {
        return resp.data;
      });
    }

    service.getIDTypeList = function () {
      return http.GET('v1/table/IDType').then(function (resp) {
        return resp.data;
      });
    }

    service.getSalutationList = function () {
      return http.GET('v1/Salutation').then(function (resp) {
        return resp.data;
      });
    }

    service.save = function (entity) {
      var method = entity.code ? 'PUT': 'POST';

      return http[method]('v1/table/Customer', entity).then(function (resp) {
        return resp ? resp.data : null;
      });
    }

    service.delete = function (entity) {
      return http.DELETE('v1/table/Customer', { 
        code: entity.code 
      }).then(function (resp) {
        return resp;
      });
    }

    service.getMailServerList = function () {
      return http.GET('v1/table/MailServer', {}).then(function (resp) {
        return resp;
      });
    }

    service.getMailServerBccList = function () {
      return http.GET('v1/table/MailServerBcc', {}).then(function (resp) {
        return resp;
      });
    }

    service.searchEmail = function(keyword) {
      return http.GET('v1/searchemail', {
        search: keyword
      }).then(function (resp) {
        return resp;
      });
    }

    return service;
  })
