var admittedList = (function () {
    /**
     * cache DOM
     */
    const $stage_zero = $('#s0_admitted_list');  // 個人申請錄取者聯絡清冊
    const $stage_zero_no_graduate = $('#s0_admitted_list_no_graduate');  // 個人申請錄取者聯絡清冊（不含研究所）
    const $stage_zero_only_graduate = $('#s0_admitted_list_only_graduate');  // 個人申請錄取者聯絡清冊（只有研究所）
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
    _setData();

    function _setData() {
        $stage_zero.attr('href', env.baseUrl + '/admins/admit/stage_zero');
        $stage_zero_no_graduate.attr('href', env.baseUrl + '/admit/stage_zero_no_graduate');
        $stage_zero_only_graduate.attr('href', env.baseUrl + '/admit/stage_zero_only_graduate');

        $stage_one.attr('href', env.baseUrl + '/admins/admit/stage_one');

        $stage_two.attr('href', env.baseUrl + '/admins/admit/stage_two');
    }
})();