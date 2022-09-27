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
            console.log(res);
            if (res.ok) {
                return res.json();
            } else {
                return false;
            }
        })
        
    }

    return {
        getSchooApplyList,
        updateApply,
        rejectApply,
        executeApply,
        updateModify,
        checkApply
    };

})();
