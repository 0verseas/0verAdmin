var School = (function () {

    var baseUrl = env.baseUrl;

    function getSchooApplyList() {
        return fetch(baseUrl + `/admins/school-apply-list`, {
            method: 'GET',
            credentials: 'include'
        });
    }

    function getApplyInfo(id) {
        return fetch(baseUrl + `/admins/school-apply-list/${id}`, {
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
            credentials: 'include'
        });
    }

    return {
        getSchooApplyList,
        getApplyInfo,
        updateApply,
        rejectApply,
        executeApply
    };

})();
