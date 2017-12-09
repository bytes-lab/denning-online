'use strict';

function Login() {
    this.isLoginPageRendered = false;
    this.isLogin = false;
    this.standalone = !helpers.inIframe();
}

Login.prototype.init = function(){
    var self = this;

    return new Promise(function(resolve, reject) {
        var saved_user = JSON.parse(localStorage.getItem('userInfo'));

        var user = {
            email: saved_user.email,
            password: helpers.decrypt(saved_user.sppid)
        };

        if(user && !app.user){
            app.room = user.tag_list;
            self.login(user)
                .then(function(){
                    resolve(true);
                }).catch(function(error){
                reject(error);
            });
        } else {
            resolve(false);
        }
    });
};

Login.prototype.login = function (user) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if(self.isLoginPageRendered){
            document.forms.loginForm.login_submit.innerText = 'loading...';
        } else {
            self.renderLoadingPage();
        }
        QB.createSession(function(csErr, csRes) {
            var userRequiredParams = {
                'email':user.email,
                'password': user.password
            };
            if (csErr) {
                loginError(csErr);
            } else {
                app.token = csRes.token;
                QB.login(userRequiredParams, function(loginErr, loginUser){
                    if(loginErr) {                        
                        loginError(loginErr);
                    } else {
                        loginSuccess(loginUser);
                    }
                });
            }
        });

        function loginSuccess(userData){
            app.user = userModule.addToCache(userData);
            app.user.user_tags = userData.user_tags;
            QB.chat.connect({userId: app.user.id, password: user.password}, function(err, roster){
                if (err) {
                    document.querySelector('.j-login__button').innerText = 'Login';
                    console.error(err);
                    reject(err);
                } else {
                    self.isLogin = true;
                    resolve();
                }
            });
        }

        function loginError(error){
            self.renderLoginPage();
            console.error(error);
            reject(error);
        }
    });
};

Login.prototype.renderLoginPage = function(){
    helpers.clearView(app.page);

    app.page.innerHTML = helpers.fillTemplate('tpl_login', {
        version: QB.version
    });
    this.isLoginPageRendered = true;
    this.setListeners();
};

Login.prototype.renderLoadingPage = function(){
    helpers.clearView(app.page);
    app.page.innerHTML = helpers.fillTemplate('tpl_loading');
};

Login.prototype.setListeners = function(){
    var self = this,
        loginForm = document.forms.loginForm,
        formInputs = [loginForm.email, loginForm.password],
        loginBtn = loginForm.login_submit;

    loginForm.addEventListener('submit', function(e){
        e.preventDefault();

        if(loginForm.hasAttribute('disabled')){
            return false;
        } else {
            loginForm.setAttribute('disabled', true);
        }

        var user = {
            email: loginForm.email.value.trim(),
            password: loginForm.password.value.trim()
        };

        var puser = {
            email: user.email,
            sppid: helpers.encrypt(user.password)
        }

        localStorage.setItem('userInfo', JSON.stringify(puser));

        self.login(user).then(function(){
            router.navigate('/dashboard');
        }).catch(function(error){
            alert('Please check email and password again!');
            loginBtn.removeAttribute('disabled');
            console.error(error);
            loginForm.login_submit.innerText = 'LOGIN';
        });
    });

    // add event listeners for each input;
    _.each(formInputs, function(i){
        i.addEventListener('focus', function(e){
            var elem = e.currentTarget,
                container = elem.parentElement;

            if (!container.classList.contains('filled')) {
                container.classList.add('filled');
            }
        });

        i.addEventListener('focusout', function(e){
            var elem = e.currentTarget,
                container = elem.parentElement;

            if (!elem.value.length && container.classList.contains('filled')) {
                container.classList.remove('filled');
            }
        });

        i.addEventListener('input', function(){
            var email = loginForm.email.value.trim(),
                password = loginForm.password.value.trim();
            if(email.length >=3 && password.length >= 3){
                loginBtn.removeAttribute('disabled');
            } else {
                loginBtn.setAttribute('disabled', true);
            }
        })
    });
};

var loginModule = new Login();
