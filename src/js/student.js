var Student = (function () {

    var baseUrl = env.baseUrl;

    function getStudentList() {
        return fetch(baseUrl + `/admins/students`, {
            credentials: 'include'
        });
    }
    return {
        getStudentList,
    };

})();
