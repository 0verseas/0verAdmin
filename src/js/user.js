var User = (function () {
    var _userInfo;
    var baseUrl = env.baseUrl;

    function _setUserInfo(userInfo) {
        _userInfo = userInfo;
    }

    function login(loginForm) {
        return fetch(baseUrl + '/admins/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(loginForm)
        });
    }

    function logout() {
        return fetch(baseUrl + '/admins/logout', {
            method: "POST",
            credentials: 'include'
        });
    }

    function isLogin() {
        return fetch(baseUrl + '/admins/login', {
            credentials: 'include'
        });
    }

    // permission: 'admin'
    function checkLogin(permission) {
        return isLogin().then(function (res) {
            if(res.ok) {
                return res.json();
            } else {
                throw res.status;
            }
        }).then(function (json) {
            if (!json[permission] || json[permission].has_banned) {
                location.replace('./login.html');
            } else {
                _setUserInfo(json);
            }
        }).catch(function (err) {
            if (err == 401) {
                location.replace('./login.html');
            }
        });
    }

    function update(userInfo) {
        return fetch(baseUrl + `/admins/account/${userInfo.username}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userInfo)
        }).then(function (res) {
            if(res.ok) {
                return res.json();
            } else {
                throw res.status;
            }
        }).then(function (json) {
            _setUserInfo(json);
            Sidebar.showUserInfo();
        });
    }

    function getUserInfo() {
        return _userInfo
    }

    return {
        login,
        logout,
        isLogin,
        checkLogin,
        getUserInfo,
        update
    }
})();
