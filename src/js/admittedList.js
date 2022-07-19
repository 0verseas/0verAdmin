var admittedList = (function () {
    /**
     * cache DOM
     */
    const $all_admitted = $('#all_admitted_list'); //錄取學生總名冊
    const $bachelor_admitted = $('#bachelor_admitted_list'); //學士班錄取學生名冊
    const $twoYear_admitted = $('#twoYear_admitted_list'); //港二技錄取學生名冊
    const $master_admitted = $('#master_admitted_list'); //碩士班錄取學生名冊
    const $phd_admitted = $('#phd_admitted_list'); //博士班錄取學生名冊
    const $bachelor_selection_admitted = $('#bachelor_selection_admitted_list'); //學士班個人申請錄取名冊
    const $bachelor_first_admitted = $('#bachelor_first_stage_admitted_list'); //學士班第一梯次錄取名冊
    const $bachelor_second_admitted = $('#bachelor_second_stage_admitted_list'); //學士班第二梯次錄取名冊
    const $bachelor_third_admitted = $('#bachelor_third_stage_admitted_list'); //學士班第三梯次錄取名冊
    const $bachelor_fourth_admitted = $('#bachelor_fourth_stage_admitted_list'); //學士班第四梯次錄取名冊
    const $bachelor_fifth_admitted = $('#bachelor_fifth_stage_admitted_list'); //學士班第五梯次錄取名冊
    const $stage_zero = $('#s0_admitted_list');  // 個人申請錄取者聯絡清冊
    const $stage_zero_only_bachelor = $('#s0_admitted_list_only_bachelor');  // 個人申請錄取者聯絡清冊（只有學士班）
    const $stage_zero_only_graduate = $('#s0_admitted_list_only_graduate');  // 個人申請錄取者聯絡清冊（只有研究所）
    const $stage_zero_only_twoYear = $('#s0_admitted_list_only_twoYear');  // 個人申請錄取者聯絡清冊（只有港二技）
    const $stage_one = $('#s1_admitted_list');      //聯合分發第一梯次錄取者聯絡清冊
    const $stage_two = $('#s2_admitted_list');     //聯合分發第二梯次錄取者聯絡清冊
    const $stage_three = $('#s3_admitted_list');  //聯合分發第三梯次錄取者聯絡清冊
    const $stage_four = $('#s4_admitted_list');  //聯合分發第四梯次錄取者聯絡清冊
    const $stage_five = $('#s5_admitted_list'); //聯合分發第五梯次錄取者聯絡清冊

    /**
     * bind event
     */

    /**
     * init
     */

    init();

    function init(){
        User.isLogin().then(function (res) {
            if(res.ok) {
                return res.json();
            } else {
                throw res.status;
            }
        }).then(function (json) {
            if (!json['admin'] || json['admin'].has_banned) {
                location.replace('./login.html');
            } else {
                _setData();
            }
        }).catch(function (err) {
            if (err == 401) {
                alert('請先登入！！');
            }
        });
    }

    function _setData() {
        // 錄取學生總名冊 主要是改分發對照用
        $all_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/all');
        $bachelor_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/1');
        $twoYear_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/2');
        $master_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/3');
        $phd_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/4');

        // 個人申請 錄取學生名冊 & 聯絡名冊
        $stage_zero.attr('href', env.baseUrl + '/admins/admit/stage_zero');
        $stage_zero_only_bachelor.attr('href', env.baseUrl + '/admins/admit/stage_zero_only_bachelor');
        $stage_zero_only_graduate.attr('href', env.baseUrl + '/admins/admit/stage_zero_only_graduate');
        $stage_zero_only_twoYear.attr('href', env.baseUrl + '/admins/admit/stage_zero_only_twoYear');
        $bachelor_selection_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/10');

        // 聯合分發 錄取學生名冊 & 聯絡名冊
        // 第一梯次
        $stage_one.attr('href', env.baseUrl + '/admins/admit/stage_one');
        $bachelor_first_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/11');
        // 第二梯次
        $stage_two.attr('href', env.baseUrl + '/admins/admit/stage_two');
        $bachelor_second_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/12');
        // 第三梯次
        $stage_three.attr('href', env.baseUrl + '/admins/admit/stage_three');
        $bachelor_third_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/13');
        // 第四梯次
        $stage_four.attr('href', env.baseUrl + '/admins/admit/stage_four');
        $bachelor_fourth_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/14');
        // 第五梯次
        $stage_five.attr('href', env.baseUrl + '/admins/admit/stage_five');
        $bachelor_fifth_admitted.attr('href', env.baseUrl + '/admins/admit/all_student_detail/15');
    }
})();