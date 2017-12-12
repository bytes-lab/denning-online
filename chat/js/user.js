'use strict';

function User() {
    this._cache = {};

    this.userListConteiner = null;
    this.content = null;

    this.denningUsers = null;
}

User.prototype.loadUsers = function(userType, keyword) {
    var self = this;
    return new Promise(function(resolve, reject){
        helpers.clearView(dialogModule.dialogsListContainer);
        dialogModule.dialogsListContainer.classList.remove('full');
        dialogModule.dialogsListContainer.classList.add('loading');

        self.getUsers().then(function(userList){
            self._loadUsers(userType, keyword);
            dialogModule.dialogsListContainer.classList.remove('loading');
        }).catch(function(error){
            dialogModule.dialogsListContainer.classList.remove('loading');
        });

        resolve();
    });
};

User.prototype._loadUsers = function(userType, keyword) {
    var self = this;
    userType = userType.replace("contact", "staff client").split(" ");
    _.each(userType, function(user_type) {
        _.each(self.denningUsers[user_type], function(firm){
            var users = _.filter(self._cache, function(user) {
                return user.name.match(new RegExp(keyword, "i")) && _.where(firm.users, {email: user.email}).length;
            })

            if (users.length) {
                self.buildFirmItem(firm);
                _.each(users, function(user) {
                    self.buildUserItem(user, false);    
                });
            }
        });
    });
};

User.prototype.initGettingUsers = function () {
    var self = this;
    self.content = document.querySelector('.j-content');
    self.userListConteiner = document.querySelector('.j-group_chat__user_list');

    self.userListConteiner.classList.add('loading');

    self.getUsers().then(function(userList){
        _.each(userList, function(user){
            self.buildUserItem(self._cache[user.id], true);
        });
        self.userListConteiner.classList.remove('loading');
    }).catch(function(error){
        self.userListConteiner.classList.remove('loading');
    });
};

User.prototype.addToCache = function(user) {
    var self = this,
        id = user.id;
    if (!self._cache[id]) {
        self._cache[id] = {
            name: user.full_name || user.login || 'Unknown user (' + id + ')',
            email: user.email,
            id: id,
            color: _.random(1, 10),
            last_request_at: user.last_request_at
        };
    } else {
        self._cache[id].last_request_at = user.last_request_at;
    }

    return self._cache[id];
};

User.prototype.getUsersByIds = function (userList) {
    var self = this,
        params = {
            filter: {
                field: 'id',
                param: 'in',
                value: userList
            },
            per_page: 100
        };

    return new Promise(function(resolve, reject) {
        QB.users.listUsers(params, function (err, responce) {
            if (err) {
                reject(err);
            } else {
                var users = responce.items;

                _.each(userList, function (id) {
                    var user = users.find(function (item) {
                        return item.user.id === id;
                    });

                    if(user !== undefined) {
                        self.addToCache(user.user);
                    }
                });
                resolve();
            }
        });
    });
};

User.prototype.getUsers = function () {
    var self = this;

    var get_qb_users = function() {
        return new Promise(function(resolve, reject) {
            var params = {
                filter: { 
                    field: 'email', 
                    param: 'in', 
                    value: helpers.getEmails(self.denningUsers)
                }
            }

            QB.users.listUsers(params, function (err, responce) {
                if (err) {
                    reject(err);
                }

                var userList = responce.items.map(function(data){
                    return self.addToCache(data.user);
                });

                resolve(userList);
            });        
        })
    };

    return new Promise(function(resolve, reject) {
        self._cache = {};
        jQuery.ajax({
            type: 'get',
            url: '/denning-online/data/chat_user?12',
            data: {},
            success: function(users) {
                self.denningUsers = JSON.parse(users);
                resolve(get_qb_users());
            }
        });            
    });
};

User.prototype.buildFirmItem = function(firm) {
    var userTpl = helpers.fillTemplate('tpl_firm', {firm: firm}),
        elem = helpers.toHtml(userTpl)[0];
    dialogModule.dialogsListContainer.appendChild(elem);        
}

User.prototype.buildUserItem = function (user, is_create) {
    var self = this,
        userItem = JSON.parse(JSON.stringify(user));

    if(userItem.id === app.user.id){
        userItem.selected = true;
    }

    var userTpl = helpers.fillTemplate('tpl_newGroupChatUser', {user: userItem}),
        elem = helpers.toHtml(userTpl)[0];
    
    if (is_create) {
        elem.addEventListener('click', function () {
            if (elem.classList.contains('disabled')) return;

            elem.classList.toggle('selected');
            
            if (self.userListConteiner.querySelectorAll('.selected').length > 1) {
                document.forms.create_dialog.create_dialog_submit.disabled = false;
            } else {
                document.forms.create_dialog.create_dialog_submit.disabled = true;
            }

            if (self.userListConteiner.querySelectorAll('.selected').length >= 3) {
                document.forms.create_dialog.dialog_name.disabled = false;
            } else {
                document.forms.create_dialog.dialog_name.disabled = true;
            }
        });
        
        self.userListConteiner.appendChild(elem);
    } else {
        elem.addEventListener('dblclick', function () {
            var params = {
                type: 3,
                occupants_ids: userItem.id
            };

            dialogModule.createDialog(params);            
        });

        dialogModule.dialogsListContainer.appendChild(elem);        
    }
};

var userModule = new User();
