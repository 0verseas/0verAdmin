var SchoolReviewer = (function () {

    var baseUrl = env.baseUrl;

    function getSchoolReviewerList() {
        return fetch(baseUrl + `/admins/school-reviewers`, {
            credentials: 'include'
        });
    }
    return {
        getSchoolReviewerList,
    };

})();
