var AccountList = (function () {

    var baseUrl = env.baseUrl;

    function getOfficeList() {
        return fetch(baseUrl + `/admins/offices`, {
            credentials: 'include'
        });
    }

    function getSchoolEditorList() {
        return fetch(baseUrl + `/admins/school-editors`, {
            credentials: 'include'
        });
    }

    function getSchoolReviewerList() {
        return fetch(baseUrl + `/admins/school-reviewers`, {
            credentials: 'include'
        });
    }

    return {
        getOfficeList,
        getSchoolEditorList,
        getSchoolReviewerList
    };

})();
