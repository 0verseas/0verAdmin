var SchoolEditor = (function () {

    var baseUrl = env.baseUrl;

    function getSchoolEditorList() {
        return fetch(baseUrl + `/admins/school-editors`, {
            credentials: 'include'
        });
    }
    return {
        getSchoolEditorList,
    };

})();
