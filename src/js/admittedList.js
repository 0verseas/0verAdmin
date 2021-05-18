var admittedList = (function () {
    /**
     * cache DOM
     */
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
        $stage_zero.attr('href', env.baseUrl + '/admins/admit/stage_zero');
        $stage_zero_only_bachelor.attr('href', env.baseUrl + '/admins/admit/stage_zero_only_bachelor');
        $stage_zero_only_graduate.attr('href', env.baseUrl + '/admins/admit/stage_zero_only_graduate');
        $stage_zero_only_twoYear.attr('href', env.baseUrl + '/admins/admit/stage_zero_only_twoYear');

        $stage_one.attr('href', env.baseUrl + '/admins/admit/stage_one');

        $stage_two.attr('href', env.baseUrl + '/admins/admit/stage_two');

        $stage_three.attr('href', env.baseUrl + '/admins/admit/stage_three');

        $stage_four.attr('href', env.baseUrl + '/admins/admit/stage_four');

        $stage_five.attr('href', env.baseUrl + '/admins/admit/stage_five');
    }
})();