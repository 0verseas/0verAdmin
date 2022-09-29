var estimateAdmissionCountFile = (function () {
    /**
     * cache DOM
     */
    const $all_university = $('#all_university');
    const $all_technology = $('#all_technology');
    const $all_all = $('#all_all');

    const $bachelor_university = $('#bachelor_university');
    const $bachelor_technology = $('#bachelor_technology');
    const $bachelor_all = $('#bachelor_all');

    const $twoYear_university = $('#twoYear_university');
    const $twoYear_technology = $('#twoYear_technology');
    const $twoYear_all = $('#twoYear_all');

    const $master_university = $('#master_university');
    const $master_technology = $('#master_technology');
    const $master_all = $('#master_all');

    const $phd_university = $('#phd_university');
    const $phd_technology = $('#phd_technology');
    const $phd_all = $('#phd_all');

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
        $all_university.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/university/system/all');
        $all_technology.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/technology/system/all');
        $all_all.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/all/system/all');

        $bachelor_university.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/university/system/bachelor');
        $bachelor_technology.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/technology/system/bachelor');
        $bachelor_all.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/all/system/bachelor');

        $twoYear_university.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/university/system/twoYear');
        $twoYear_technology.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/technology/system/twoYear');
        $twoYear_all.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/all/system/twoYear');

        $master_university.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/university/system/master');
        $master_technology.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/technology/system/master');
        $master_all.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/all/system/master');

        $phd_university.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/university/system/phd');
        $phd_technology.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/technology/system/phd');
        $phd_all.attr('href', env.baseUrl + '/admins/estimate-admission-count-file/all/system/phd');

        $has_restrict_department.attr('href', env.baseUrl + '/admins/has-birth-and-gender-limit-department-list');
        $bachelor_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/bachelor');
        $master_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/master');
        $phd_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/phd');
        
    }
})();