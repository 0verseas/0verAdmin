var Student = (function () {

    var baseUrl = env.baseUrl;

    function getStudentList() {
        return fetch(baseUrl + `/admins/students`, {
            credentials: 'include'
        });
    }

    function getStudentInfo(UserId) { // 取得某學生詳細資料
        return fetch(baseUrl + `/admins/students/${UserId}`, {
            credentials: 'include'
        })
    }

    function getSchoolType(countryId) {
		return fetch(baseUrl + `/country-school-type?country_id=` + countryId, {
			method: 'GET'
		});
	}

    return {
        getStudentList,
        getStudentInfo,
        getSchoolType
    };

})();
