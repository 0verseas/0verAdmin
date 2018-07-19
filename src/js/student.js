var Student = (function () {

    var baseUrl = env.baseUrl;

    function getStudentList() {
        return fetch(baseUrl + `/admins/students`, {
            credentials: 'include'
        });
    }

    function getStudentInfo(UserId) { // 取得某學制某系所
        return fetch(baseUrl + `/admins/students/${UserId}`, {
            credentials: 'include'
        })
    }

    return {
        getStudentList,
        getStudentInfo
    };

})();
