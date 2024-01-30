var School = (function () {

    var baseUrl = env.baseUrl;

    function getSchooApplyList() {
        return fetch(baseUrl + `/admins/school-apply-list`, {
            method: 'GET',
            credentials: 'include'
        });
    }

    function updateApply(id) {
        return fetch(baseUrl + `/admins/school-apply-list/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
    }

    function rejectApply(id) {
        return fetch(baseUrl + `/admins/school-apply-list/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
				'Content-Type': 'application/json'
			}
        });
    }

    function executeApply(id) {
        return fetch(baseUrl + `/admins/execute-school-apply?id=${id}`, {
            method: 'GET',
            credentials: 'include'
        });
    }

    function returnApply(data) {
        return fetch(baseUrl + `/admins/return-school-apply`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    function updateModify(data, verified) {
        return fetch(baseUrl + `/admins/execute-school-apply?verified=${verified}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    function checkApply(id) {
        return fetch(baseUrl + `/admins/check-school-apply?id=${id}`, {
            method: 'GET',
            credentials: 'include'
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw res.status;
            }
        }).catch((err) => {
            if (err == 401) {
                swal({title: `警告`, text: '請先登入！', type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
                .then((res) => {
                    location.replace('./login.html');
                    return false;
                });
            }
        });

    }

    return {
        getSchooApplyList,
        updateApply,
        rejectApply,
        executeApply,
        updateModify,
        returnApply,
        checkApply
    };

})();
