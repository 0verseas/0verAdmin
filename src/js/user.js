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
        }).then((res) => {
            if(res.ok) {
                return res.json();
            } else {
                throw res.status;
            }
        }).then((json) => {
            if (!json['admin'] || json['admin'].has_banned) {
                location.replace('./login.html');
            } else {
                _setUserInfo(json);
                return true;
            }
        }).catch((err) => {
            if (err == 401) {
                swal({title: `請先登入！`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
                .then((res) => {
                    location.replace('./login.html');
                    return false;
                });
            }
        });
    }

    function update(userInfo) {
        return fetch(baseUrl + `/admins/account/update`, {
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

    function getAdmissionOpenTime(){
        return fetch(baseUrl + '/admins/admission-open-time', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    }

    return {
        login,
        logout,
        isLogin,
        getUserInfo,
        update,
        getAdmissionOpenTime
    }
})();
