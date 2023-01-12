var estimateAdmissionCountFile = (function () {
    /**
     * cache DOM
     */

    const $all_student_list = $('#all-student-list');
    const $has_restrict_department = $('#has-restrict-department');
    const $bachelor_has_english_taught_department = $('#bachelor-has-english-taught-department');
    const $twoYear_has_english_taught_department = $('#twoYear-has-english-taught-department');
    const $master_has_english_taught_department = $('#master-has-english-taught-department');
    const $phd_has_english_taught_department = $('#phd-has-english-taught-department');
    /**
     * bind event
     */

    /**
     * init
     */
    init();

    async function init(){
        let res = await User.isLogin();
        if(res == true) {
            _setData();
        }
    }

    function _setData() {

        $all_student_list.attr('href', env.baseUrl + '/admins/students/create');
        $has_restrict_department.attr('href', env.baseUrl + '/admins/has-birth-and-gender-limit-department-list');
        $bachelor_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/bachelor');
        $twoYear_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/twoYear');
        $master_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/master');
        $phd_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/phd');

    }
})();